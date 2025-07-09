import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PROPS from "@/types/MemberMangementProps";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, UserCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import MemberManagementAPI from "../../../api/community/MemberManagementAPI";

export default function Invite_MemberManagement(props: PROPS) {
  const { ID } = useParams();

  const { mutations,isAdmin,handleAction } = MemberManagementAPI(props);

  return (
    <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-600">
        <CardTitle className="text-2xl font-semibold text-white">
          Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {props.filteredMembers
            .filter((m) => m.role === "QUEUE")
            .map((invite) => (
              <li
                key={invite.id}
                className="flex flex-col md:flex-row md:items-center justify-between py-4 transition-all duration-300 hover:bg-yellow-50"
              >
                <div className="flex items-center mb-2 md:mb-0 ml-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={invite.avatar} alt={invite.name} />
                    <AvatarFallback>{invite.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-gray-700 text-lg block">
                      {invite.name}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {invite.email}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined since: {invite.joinedAt.slice(0, 10)}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2 mt-2 md:mt-0 mr-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 text-green-600 hover:bg-green-100"
                      onClick={() =>
                        handleAction(
                          () =>
                            mutations.accept.mutateAsync({
                              communityId: parseInt(ID!, 10),
                              member_id: invite.id,
                            }),
                          `Accept ${invite.name} as a member?`
                        )
                      }
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
