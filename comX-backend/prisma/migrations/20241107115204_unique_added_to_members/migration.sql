/*
  Warnings:

  - A unique constraint covering the columns `[communityId,projectId,userId]` on the table `ProjectMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembers_communityId_projectId_userId_key" ON "ProjectMembers"("communityId", "projectId", "userId");
