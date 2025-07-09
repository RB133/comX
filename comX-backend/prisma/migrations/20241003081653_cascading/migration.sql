-- DropForeignKey
ALTER TABLE "CommunityMember" DROP CONSTRAINT "CommunityMember_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityMember" DROP CONSTRAINT "CommunityMember_userId_fkey";

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
