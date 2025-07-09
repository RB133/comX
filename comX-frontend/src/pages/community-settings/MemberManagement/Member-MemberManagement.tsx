import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Trash2, UserPlus, UserX } from "lucide-react";
import { useParams } from "react-router-dom";
import MemberManagementAPI from "../../../api/community/MemberManagementAPI";
import PROPS from "@/types/MemberMangementProps";

export default function Members_MemberManagement(props: PROPS) {
  const { ID } = useParams();

  const { mutations, isAdmin, handleAction } = MemberManagementAPI(props);

  return (
    <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
        <CardTitle className="text-2xl font-semibold text-white">
          Member List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {props.filteredMembers
            .filter((m) => m.role === "MEMBER")
            .map((member) => (
              <li
                key={member.id}
                className="flex flex-col md:flex-row md:items-center justify-between py-4 transition-all duration-300 hover:bg-blue-50"
              >
                <div className="flex items-center mb-2 md:mb-0 ml-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-gray-700 text-lg block">
                      {member.name}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {member.email}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined: {member.joinedAt.slice(0, 10)}
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
                            mutations.promote.mutateAsync({
                              communityId: parseInt(ID!, 10),
                              promoting_id: member.id,
                            }),
                          `Promote ${member.name} to admin?`
                        )
                      }
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Promote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-50 text-red-600 hover:bg-red-100"
                      onClick={() =>
                        handleAction(
                          () =>
                            mutations.ban.mutateAsync({
                              communityId: parseInt(ID!, 10),
                              baning_id: member.id,
                            }),
                          `Ban ${member.name}?`
                        )
                      }
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Ban
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-50 text-gray-600 hover:bg-gray-100"
                      onClick={() =>
                        handleAction(
                          () =>
                            mutations.remove.mutateAsync({
                              communityId: parseInt(ID!, 10),
                              removingId: member.id,
                            }),
                          `Remove ${member.name}?`
                        )
                      }
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
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
