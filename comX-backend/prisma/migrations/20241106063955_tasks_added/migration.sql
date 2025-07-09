/*
  Warnings:

  - Added the required column `deadline` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INPROGRESS', 'PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'LOW', 'MEDIUM');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "milestones" TEXT[],
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "referenceLinks" TEXT[],
    "milestone" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "Status" NOT NULL DEFAULT 'INPROGRESS',
    "deadline" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "projectId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
