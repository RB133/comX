-- CreateEnum
CREATE TYPE "socialLinks" AS ENUM ('TWITTER', 'GITHUB', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'LEETCODE', 'CODEFORCES', 'CODECHEF');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "_UserFollowers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollowers_AB_unique" ON "_UserFollowers"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollowers_B_index" ON "_UserFollowers"("B");

-- AddForeignKey
ALTER TABLE "_UserFollowers" ADD CONSTRAINT "_UserFollowers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowers" ADD CONSTRAINT "_UserFollowers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
