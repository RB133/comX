/*
  Warnings:

  - Added the required column `color` to the `CommunityCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CommunityCalendar_userId_communityId_key";

-- AlterTable
ALTER TABLE "CommunityCalendar" ADD COLUMN     "color" TEXT NOT NULL;
