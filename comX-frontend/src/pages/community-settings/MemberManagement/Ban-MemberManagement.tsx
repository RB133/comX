import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PROPS from "@/types/MemberMangementProps";
import { Calendar, Mail, UserCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import MemberManagementAPI from "../../../api/community/MemberManagementAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Ban_MemberManagement(props:PROPS) {
  const { ID } = useParams();

  const { mutations,isAdmin,handleAction } = MemberManagementAPI(props);

  return (
    <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600">
        <CardTitle className="text-2xl font-semibold text-white">
          Banned Members
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {props.filteredMembers
            .filter((m) => m.role === "BANNED")
            .map((banned) => (
              <li
                key={banned.id}
                className="flex flex-col md:flex-row md:items-center justify-between py-4 transition-all duration-300 hover:bg-red-50"
              >
                <div className="flex items-center mb-2 md:mb-0 ml-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={banned.avatar} alt={banned.name} />
                    <AvatarFallback>{banned.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-gray-700 text-lg block">
                      {banned.name}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {banned.email}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Banned since: {banned.joinedAt.slice(0, 10)}
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
                            mutations.remove.mutateAsync({
                              communityId: parseInt(ID!, 10),
                              removingId: banned.id,
                            }),
                          `Reinstate ${banned.name} as a member?`
                        )
                      }
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Reinstate
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
