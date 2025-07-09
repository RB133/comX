/*
  Warnings:

  - You are about to drop the column `projectImage` on the `Project` table. All the data in the column will be lost.
  - Added the required column `communityId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projectImage",
ADD COLUMN     "communityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
