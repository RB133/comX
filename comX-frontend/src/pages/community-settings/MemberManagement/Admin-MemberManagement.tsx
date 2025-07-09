import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/state/store";
import PROPS from "@/types/MemberMangementProps";
import { Calendar, Mail, Trash2, UserMinus } from "lucide-react";
import { useSelector } from "react-redux";
import MemberManagementAPI from "../../../api/community/MemberManagementAPI";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Admin_MemberManagement(props: PROPS) {
  const { ID } = useParams();

  const user = useSelector((state: RootState) => state.userDetails);

  const { mutations,isAdmin,handleAction } = MemberManagementAPI(props);

  return (
    <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600">
        <CardTitle className="text-2xl font-semibold text-white">
          Admins
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {props.filteredMembers
            .filter((m) => m.role === "ADMIN" || m.role === "OWNER")
            .map((admin) => (
              <li
                key={admin.id}
                className="flex flex-col md:flex-row md:items-center justify-between py-4 transition-all duration-300 hover:bg-green-50"
              >
                <div className="flex items-center mb-2 md:mb-0 ml-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-gray-700 text-lg block">
                      {admin.name}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {admin.email}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Admin since: {admin.joinedAt.slice(0, 10)}
                    </span>
                  </div>
                </div>
                {admin.role === "ADMIN" &&
                  admin.id !== user.user?.id &&
                  isAdmin && (
                    <div className="flex space-x-2 mt-2 md:mt-0 mr-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                        onClick={() =>
                          handleAction(
                            () =>
                              mutations.demote.mutateAsync({
                                communityId: parseInt(ID!, 10),
                                demoting_id: admin.id,
                              }),
                            `Demote ${admin.name} to member?`
                          )
                        }
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Demote
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
                                removingId: admin.id,
                              }),
                            `Remove ${admin.name}?`
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
