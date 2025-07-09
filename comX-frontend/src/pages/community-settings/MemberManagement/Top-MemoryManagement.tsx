import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, Users, UserX as UserBan, UserRoundPen } from "lucide-react";

export default function Top_MemoryManagement({
  memberCount,
  adminCount,
  bannedCount,
  inviteCount,
}: {
  memberCount: number;
  adminCount: number;
  bannedCount: number;
  inviteCount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl h-48 flex justify-center flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-blue-600">
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-12 w-12 text-blue-500 mr-4" />
            <div>
              <p className="text-4xl font-bold text-blue-800">{memberCount}</p>
              <p className="text-sm text-blue-600">Active users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl h-48 flex justify-center flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-green-600">
            Admins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <UserCog className="h-12 w-12 text-green-500 mr-4" />
            <div>
              <p className="text-4xl font-bold text-green-800">{adminCount}</p>
              <p className="text-sm text-green-600">System administrators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl h-48 flex justify-center flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-yellow-400">
            Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <UserRoundPen className="h-12 w-12 text-yellow-400 mr-4"/>
            <div>
              <p className="text-4xl font-bold text-yellow-600">{inviteCount}</p>
              <p className="text-sm text-yellow-400">Requests</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg transition-all duration-300 hover:shadow-xl h-48 flex justify-center flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-red-600">
            Banned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <UserBan className="h-12 w-12 text-red-500 mr-4" />
            <div>
              <p className="text-4xl font-bold text-red-800">{bannedCount}</p>
              <p className="text-sm text-red-600">Restricted accounts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
