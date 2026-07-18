import EditProfileAPI from "@/api/profile/EditProfileAPI";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { designation } from "@/lib/designation";
import { PublicProfile } from "@/types/UserProfile";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function PersonalInfoSettings({
  profile,
}: {
  profile: PublicProfile;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(profile.designation);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [skillsInput, setSkillsInput] = useState(profile.skills.join(", "));
  const [file, setFile] = useState<File | undefined>(undefined);

  const { handleEditProfile, editProfilePending } = EditProfileAPI();

  useEffect(() => {
    if (!open) return;
    setSelectedDesignation(profile.designation);
    setBio(profile.bio ?? "");
    setLocation(profile.location ?? "");
    setWebsite(profile.website ?? "");
    setPhone(profile.phone ?? "");
    setSkillsInput(profile.skills.join(", "));
    setFile(undefined);
  }, [open, profile]);

  const handleSubmit = async () => {
    await handleEditProfile({
      designation: selectedDesignation,
      bio,
      location,
      website,
      phone,
      skills: skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      file,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update the profile details shown on your public page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="designation">Designation</Label>
            <Select
              value={selectedDesignation}
              onValueChange={setSelectedDesignation}
            >
              <SelectTrigger id="designation">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {designation.map((item) => (
                  <SelectItem key={item.id} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919999999999"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </div>
        </div>

        <DialogFooter>
          {editProfilePending ? (
            <Button disabled>
              <ReloadIcon className="mr-2 animate-spin w-4 h-4" />
              Saving...
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Save Changes</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
