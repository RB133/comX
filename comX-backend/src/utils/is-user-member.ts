import { prisma } from "../config/dbConnect";

export const isUserMember = async(userId: number, communityId: number) => {
    const isMember = await prisma.communityMember.findUnique({
        where: {
          userId_communityId: {
            userId,
            communityId,
          },
        },
      });
    
    return isMember;
}