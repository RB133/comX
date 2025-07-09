-- CreateEnum
CREATE TYPE "Scope" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "scope" "Scope" NOT NULL DEFAULT 'PUBLIC';
