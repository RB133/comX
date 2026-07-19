/**
 * One-off script to populate a real community with dummy members, a dummy
 * project, and dummy tasks — for manually testing the dashboard/profile UI
 * against realistic-looking data instead of an empty account.
 *
 * Usage:
 *   npx tsx prisma/seed-dummy-data.ts "Exact Community Name"
 *
 * Run with no argument to list every community name currently in the
 * database. Point DATABASE_URL (in .env, or inline on the command line) at
 * whichever database you want this to affect — local or production.
 */
import "dotenv/config";
import bcryptjs from "bcryptjs";
import { PrismaClient, Priority, Status } from "@prisma/client";

const prisma = new PrismaClient();

const DUMMY_PASSWORD = "Dummy@1234";

const DUMMY_PEOPLE = [
  { name: "Ava Thompson", designation: "Frontend Developer" },
  { name: "Noah Patel", designation: "Backend Developer" },
  { name: "Maya Rodriguez", designation: "Product Designer" },
  { name: "Liam Chen", designation: "DevOps Engineer" },
  { name: "Sophia Kim", designation: "Product Manager" },
  { name: "Ethan Walker", designation: "QA Engineer" },
];

const MILESTONES = ["Kickoff", "MVP", "Beta Release"];

const TASK_TITLES = [
  "Set up project repository",
  "Design database schema",
  "Build authentication flow",
  "Create landing page",
  "Write API documentation",
  "Set up CI pipeline",
  "Fix responsive layout bugs",
  "Add unit tests for core modules",
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z]+/g, "");
}

async function main() {
  const communityName = process.argv[2];

  if (!communityName) {
    const communities = await prisma.community.findMany({ select: { name: true } });
    console.log("Usage: npx tsx prisma/seed-dummy-data.ts \"Exact Community Name\"\n");
    console.log("Communities currently in the database:");
    communities.forEach((c) => console.log(`  - ${c.name}`));
    return;
  }

  const community = await prisma.community.findUnique({
    where: { name: communityName },
    include: { members: { where: { role: "OWNER" }, include: { user: true } } },
  });

  if (!community) {
    throw new Error(`No community named "${communityName}" was found.`);
  }

  const owner = community.members[0]?.user;
  if (!owner) {
    throw new Error(`Community "${communityName}" has no owner on record.`);
  }

  const hashedPassword = await bcryptjs.hash(DUMMY_PASSWORD, 10);
  const suffix = Date.now().toString().slice(-5);

  const dummyUsers = [];
  for (const person of DUMMY_PEOPLE) {
    const base = slugify(person.name);
    const username = `${base}${suffix}`;
    const email = `${base}${suffix}@example.com`;

    const user = await prisma.user.create({
      data: {
        name: person.name,
        username,
        email,
        password: hashedPassword,
        designation: person.designation,
        isVerified: true,
      },
    });
    dummyUsers.push(user);
  }
  console.log(`Created ${dummyUsers.length} dummy users (password: ${DUMMY_PASSWORD}).`);

  await prisma.communityMember.createMany({
    data: dummyUsers.map((user) => ({
      userId: user.id,
      communityId: community.id,
      role: "MEMBER" as const,
    })),
  });
  console.log(`Added them all to "${community.name}".`);

  const project = await prisma.project.create({
    data: {
      name: "Demo Project",
      description: "A sample project generated to preview the dashboard with realistic data.",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      milestones: MILESTONES,
      ownerId: owner.id,
      communityId: community.id,
    },
  });
  console.log(`Created project "${project.name}".`);

  const allMembers = [owner, ...dummyUsers];
  await prisma.projectMembers.createMany({
    data: allMembers.map((user) => ({
      projectId: project.id,
      communityId: community.id,
      userId: user.id,
    })),
  });

  // Spread tasks over the last few weeks so the profile heatmap shows a
  // realistic trail of activity leading up to today, plus some still open.
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const taskRows = TASK_TITLES.map((title, index) => {
    const assignee = allMembers[index % allMembers.length];
    const daysAgo = index * 2;
    const isCompleted = index < TASK_TITLES.length - 2;
    const status: Status = isCompleted ? "COMPLETED" : index % 2 === 0 ? "INPROGRESS" : "PENDING";

    return {
      title,
      milestone: MILESTONES[index % MILESTONES.length],
      priority: priorities[index % priorities.length],
      status,
      deadline: new Date(Date.now() + (7 - daysAgo) * 24 * 60 * 60 * 1000),
      completedDate: isCompleted ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000) : null,
      projectId: project.id,
      assignId: assignee.id,
    };
  });

  await prisma.task.createMany({ data: taskRows });
  console.log(`Created ${taskRows.length} dummy tasks across the project.`);

  console.log("\nDone. Refresh the dashboard/profile to see the new data.");
}

main()
  .catch((error) => {
    console.error(error.message ?? error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
