/*
  Warnings:

  - You are about to drop the column `communityId` on the `ProjectMembers` table. All the data in the column will be lost.
  - Added the required column `communityId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `ProjectMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMembers" DROP CONSTRAINT "ProjectMembers_communityId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "communityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectMembers" DROP COLUMN "communityId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
