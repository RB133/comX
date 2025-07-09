import {
  Calendar,
  MapPin,
  Link,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import ErrorPage from "@/pages/genral/ErrorPage";
import ProfileAPI from "@/api/profile/ProfileAPI";

export default function PersonalInfo() {
  const { profile, profileLoading, profileError } = ProfileAPI();

  if (profileLoading) return <div>Loading ...</div>;
  if (profileError) return <ErrorPage />;

  const projects = profile.projects.length;

  return (
    <Card className="w-full max-w-lg shadow-xl border border-gray-200">
      <CardHeader className="flex flex-col items-center text-center space-y-2">
        <Avatar className="w-24 h-24 mb-3 rounded-full shadow-lg">
          <AvatarImage src={profile.avatar} alt={`${profile.name}'s avatar`} />
          <AvatarFallback className="flex items-center justify-center bg-muted-foreground text-background w-full h-full rounded-full font-semibold">
            {profile.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-semibold">{profile.name}</CardTitle>
        <div className="text-muted-foreground text-sm">@{profile.username}</div>
        <p className="text-xs font-medium uppercase tracking-wider bg-secondary text-secondary-foreground px-3 py-1 rounded-md">
          {profile.designation}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center text-muted-foreground">
          {profile.bio ?? ""}
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{0}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{0}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{projects}</div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          {profile.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-muted-foreground" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {new Date(profile.registeredAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <Separator />
        {profile.skills.length > 0 && (
          <>
            <div>
              <div className="flex flex-wrap gap-2">
                <h3 className="font-semibold mb-2">Skills</h3>
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Skill Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="w-full" />
              </div>
            </div>
            <Separator />
          </>
        )}
        <div className="flex justify-center space-x-4">
          {profile.socialLinks.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter profile</span>
              </Button>
            </a>
          )}
          {profile.socialLinks.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub profile</span>
              </Button>
            </a>
          )}
          {profile.socialLinks.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn profile</span>
              </Button>
            </a>
          )}
          {profile.socialLinks.codechef && (
            <a
              href={profile.socialLinks.codechef}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">CodeChef profile</span>
              </Button>
            </a>
          )}
          {profile.socialLinks.codeforces && (
            <a
              href={profile.socialLinks.codeforces}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">Codeforces profile</span>
              </Button>
            </a>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Edit Profile</Button>
        <Button variant="destructive">Logout</Button>
      </CardFooter>
    </Card>
  );
}
