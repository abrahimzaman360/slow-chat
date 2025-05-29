import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookKeyIcon, MessageCircle, UserIcon } from "lucide-react";
import { toast } from "sonner";

export const PrivacySettings = () => {
  const [messagePrivacy, setMessagePrivacy] = useState({
    readReceipts: true,
    onlineStatus: true,
    lastSeen: false,
    whoCanMessage: "everyone",
  });

  const [storyPrivacy, setStoryPrivacy] = useState({
    whoCanView: "friends",
    showViewers: true,
  });

  const handleMessagePrivacyToggle = (setting: string, value: boolean) => {
    setMessagePrivacy((prev) => ({ ...prev, [setting]: value }));

    toast.success("Message privacy settings updated!", {
      duration: 5000,
      richColors: true,
      description: `Message ${setting} has been ${
        value ? "enabled" : "disabled"
      }`,
    });
  };

  const handleStoryPrivacyToggle = (setting: string, value: boolean) => {
    setStoryPrivacy((prev) => ({ ...prev, [setting]: value }));

    toast.success("Story privacy settings updated!", {
      duration: 5000,
      richColors: true,
      description: `Story ${setting} has been ${
        value ? "enabled" : "disabled"
      }`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Messages Privacy */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 py-0 text-xl">
            <MessageCircle className="w-6 h-6" /> Conversation Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-6">
            {/* Read Receipts */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Read Receipts</h3>
                <p className="text-gray-600 text-sm">
                  Show when you've read messages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    messagePrivacy.readReceipts ? "default" : "secondary"
                  }
                >
                  {messagePrivacy.readReceipts ? "On" : "Off"}
                </Badge>
                <Switch
                  checked={messagePrivacy.readReceipts}
                  onCheckedChange={(value) =>
                    handleMessagePrivacyToggle("readReceipts", value)
                  }
                />
              </div>
            </div>

            {/* Online Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Online Status</h3>
                <p className="text-gray-600 text-sm">
                  Show when you're online to others
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    messagePrivacy.onlineStatus ? "default" : "secondary"
                  }
                >
                  {messagePrivacy.onlineStatus ? "Visible" : "Hidden"}
                </Badge>
                <Switch
                  checked={messagePrivacy.onlineStatus}
                  onCheckedChange={(value) =>
                    handleMessagePrivacyToggle("onlineStatus", value)
                  }
                />
              </div>
            </div>

            {/* Last Seen */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Last Seen</h3>
                <p className="text-gray-600 text-sm">
                  Show when you were last active
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={messagePrivacy.lastSeen ? "default" : "secondary"}
                >
                  {messagePrivacy.lastSeen ? "Visible" : "Hidden"}
                </Badge>
                <Switch
                  checked={messagePrivacy.lastSeen}
                  onCheckedChange={(value) =>
                    handleMessagePrivacyToggle("lastSeen", value)
                  }
                />
              </div>
            </div>

            {/* Who Can Message */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Who Can Message You</h3>
                  <p className="text-gray-600 text-sm">
                    Control who can send you messages
                  </p>
                </div>
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Select
                value={messagePrivacy.whoCanMessage}
                onValueChange={(value) =>
                  setMessagePrivacy((prev) => ({
                    ...prev,
                    whoCanMessage: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="contacts">Contacts Only</SelectItem>
                  <SelectItem value="nobody">Nobody</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stories Privacy */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 py-0 text-xl">
            <BookKeyIcon className="h-5 w-5" />
            Stories Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-6">
            {/* Who Can View Stories */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Who Can View Your Stories</h3>
                  <p className="text-gray-600 text-sm">
                    Control who can see your stories
                  </p>
                </div>
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Select
                value={storyPrivacy.whoCanView}
                onValueChange={(value) =>
                  setStoryPrivacy((prev) => ({ ...prev, whoCanView: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="close-friends">Close Friends</SelectItem>
                  <SelectItem value="custom">Custom List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show Viewers */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Show Story Viewers</h3>
                <p className="text-gray-600 text-sm">
                  Display who has viewed your stories
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={storyPrivacy.showViewers ? "default" : "secondary"}
                >
                  {storyPrivacy.showViewers ? "Visible" : "Hidden"}
                </Badge>
                <Switch
                  checked={storyPrivacy.showViewers}
                  onCheckedChange={(value) =>
                    handleStoryPrivacyToggle("showViewers", value)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Summary */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 py-0 text-xl">
            Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Message Privacy Level
              </h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {messagePrivacy.readReceipts || messagePrivacy.onlineStatus
                  ? "Standard"
                  : "High"}
              </div>
              <p className="text-sm text-blue-800">
                Based on your current settings
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                Story Privacy Level
              </h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {storyPrivacy.whoCanView === "everyone" ? "Open" : "Restricted"}
              </div>
              <p className="text-sm text-purple-800">
                Stories are{" "}
                {storyPrivacy.whoCanView === "everyone"
                  ? "publicly visible"
                  : "limited to selected audience"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
