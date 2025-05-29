import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Link, ShieldIcon } from "lucide-react";
import { toast } from "sonner";

export const AccountManagement = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    github: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match", {
        richColors: true,
        duration: 5000,
        description: "Please make sure both passwords match.",
      });
      return;
    }
    toast.success("Password updated successfully!", {
      duration: 5000,
      richColors: true,
      description: "Your password has been updated successfully.",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleConnection = (provider: "google" | "github") => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
    toast.success(
      `${provider} ${
        connectedAccounts[provider] ? "Disconnected" : "Connected"
      }`,
      {
        duration: 5000,
        richColors: true,
        description: `Your ${provider} account has been ${
          connectedAccounts[provider] ? "disconnected" : "connected"
        }.`,
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 py-0 text-xl">
            <ShieldIcon className="h-5 w-5" />
            Two Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Secure your account</h3>
              <p className="text-gray-600 text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                Two-factor authentication is active. You'll need your
                authenticator app to sign in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 py-0 text-xl">
            <Key className="h-5 w-5" />
            Profile Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* OAuth Connections */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 py-0 text-xl">
            <Link className="h-5 w-5" />
            Third Party Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  G
                </div>
                <div>
                  <h3 className="font-semibold">Google</h3>
                  <p className="text-gray-600 text-sm">
                    Sign in with your Google account
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={connectedAccounts.google ? "default" : "secondary"}
                >
                  {connectedAccounts.google ? "Connected" : "Not Connected"}
                </Badge>
                <Button
                  variant={connectedAccounts.google ? "destructive" : "default"}
                  onClick={() => toggleConnection("google")}
                >
                  {connectedAccounts.google ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white font-bold text-sm">
                  GH
                </div>
                <div>
                  <h3 className="font-semibold">GitHub</h3>
                  <p className="text-gray-600 text-sm">
                    Sign in with your GitHub account
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={connectedAccounts.github ? "default" : "secondary"}
                >
                  {connectedAccounts.github ? "Connected" : "Not Connected"}
                </Badge>
                <Button
                  variant={connectedAccounts.github ? "destructive" : "default"}
                  onClick={() => toggleConnection("github")}
                >
                  {connectedAccounts.github ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
