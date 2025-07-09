"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Moon, Sun, Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [digestEmails, setDigestEmails] = useState("none");
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-8 flex flex-col items-center justify-center overflow-y-scroll no-scrollbar"
      >
        <div className="w-full max-w-3xl">
          <motion.div variants={itemAnimation} className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-blue-600 leading-snug">
              Notification Preferences
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Customize and manage your community experience.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Mail className="text-blue-600 w-5 h-5" />
                  <Label
                    htmlFor="email-notifications"
                    className="text-lg font-medium"
                  >
                    Email Notifications
                  </Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <p className="text-sm text-gray-600 ml-9">
                Receive important updates and announcements via email. This
                includes account notifications, security alerts, and community
                highlights.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Bell className="text-blue-600 w-5 h-5" />
                  <Label
                    htmlFor="push-notifications"
                    className="text-lg font-medium"
                  >
                    Push Notifications
                  </Label>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <p className="text-sm text-gray-600 ml-9">
                Get real-time alerts on your device for immediate updates,
                messages, and time-sensitive information.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Mail className="text-blue-600 w-5 h-5" />
                  <Label
                    htmlFor="digest-emails"
                    className="text-lg font-medium"
                  >
                    Digest Emails
                  </Label>
                </div>
                <Select value={digestEmails} onValueChange={setDigestEmails}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-600 ml-9">
                Receive a summary of activities and updates at your preferred
                frequency. Great for staying informed without overwhelming your
                inbox.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {doNotDisturb ? (
                    <Moon className="text-blue-600 w-5 h-5" />
                  ) : (
                    <Sun className="text-blue-600 w-5 h-5" />
                  )}
                  <Label
                    htmlFor="do-not-disturb"
                    className="text-lg font-medium"
                  >
                    Do Not Disturb
                  </Label>
                </div>
                <Switch
                  id="do-not-disturb"
                  checked={doNotDisturb}
                  onCheckedChange={setDoNotDisturb}
                />
              </div>
              <p className="text-sm text-gray-600 ml-9">
                Temporarily pause all notifications. Ideal for focused work
                sessions or during off-hours. You can customize the duration in
                the settings.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center justify-center mx-auto">
                  <Info className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    Learn more about our notification system
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Our notification system is designed to keep you informed while
                  respecting your preferences and privacy.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
