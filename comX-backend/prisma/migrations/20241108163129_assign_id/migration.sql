/*
  Warnings:

  - You are about to drop the column `UserId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `assignId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_UserId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "UserId",
ADD COLUMN     "assignId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
