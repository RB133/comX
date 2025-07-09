"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  MessageSquare,
  UserPlus,
  AlertTriangle,
  LucideProps,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PROPS {
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children: ReactNode;
}

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

export default function Permissions() {
  const [contentModeration, setContentModeration] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  return (
    <div className="p-8 w-full h-full bg-white overflow-y-scroll no-scrollbar">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerAnimation}
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Page Header */}
        <motion.div variants={itemAnimation} className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 leading-snug">
            Community Settings
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Customize and manage your community experience.
          </p>
        </motion.div>

        {/* Setting Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          <SettingCard
            title="Privacy"
            description="Control who can access your community"
            icon={Shield}
          >
            <SelectField
              id="community-privacy"
              label="Community Privacy"
              options={[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
            />
          </SettingCard>

          <SettingCard
            title="Membership"
            description="Manage how members join"
            icon={Users}
          >
            <SelectField
              id="member-approval"
              label="Member Approval"
              options={[
                { value: "auto", label: "Auto-Approval" },
                { value: "manual", label: "Manual Approval" },
              ]}
            />
          </SettingCard>

          <SettingCard
            title="Content Management"
            description="Set content creation and moderation rules"
            icon={MessageSquare}
          >
            <SelectField
              id="who-can-post"
              label="Who Can Post?"
              options={[
                { value: "admins", label: "Owner/Admins only" },
                { value: "all", label: "All members" },
              ]}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="content-moderation">Content Moderation</Label>
                <p className="text-sm text-gray-500">
                  Enable review of posts before publishing.
                </p>
              </div>
              <Switch
                id="content-moderation"
                checked={contentModeration}
                onCheckedChange={setContentModeration}
              />
            </div>
          </SettingCard>

          <SettingCard
            title="Invitations"
            description="Control who can invite new members"
            icon={UserPlus}
          >
            <SelectField
              id="invite-permissions"
              label="Invite Permissions"
              options={[
                { value: "owner", label: "Owner only" },
                { value: "admins", label: "Admins" },
                { value: "all", label: "All members" },
              ]}
            />
          </SettingCard>
        </div>

        {/* Reporting System Card */}
        <motion.div variants={itemAnimation}>
          <Card className="border shadow-md">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Reporting System
              </CardTitle>
              <CardDescription>
                Set up and manage content reporting configurations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SelectField
                id="report-reason"
                label="Report Reason"
                value={reportReason}
                onChange={setReportReason}
                options={[
                  { value: "spam", label: "Spam" },
                  { value: "harassment", label: "Harassment" },
                  { value: "inappropriate", label: "Inappropriate Content" },
                  { value: "misinformation", label: "Misinformation" },
                  { value: "other", label: "Other" },
                ]}
              />
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  placeholder="Provide additional details"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => alert("Report system configured")}
              >
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

const SettingCard = ({ title, description, icon: Icon, children }: PROPS) => (
  <motion.div variants={itemAnimation} className="h-full">
    <Card className="h-full bg-white border shadow-sm transition hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-700">
          <Icon className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
);

const SelectField = ({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-gray-700 font-medium">
      {label}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
