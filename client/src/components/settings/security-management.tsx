import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, MessageSquare, Settings } from 'lucide-react';
import { toast } from 'sonner';

export const SecuritySettings = () => {
  const [chatLock, setChatLock] = useState(false);
  const [appLock, setAppLock] = useState(true);

  const handleChatLockToggle = (enabled: boolean) => {
    setChatLock(enabled);

    toast.success(`Chat Lock ${enabled ? 'Enabled' : 'Disabled'}`, {
      description: `Chat conversations are now ${enabled ? 'locked and require authentication' : 'unlocked'}.`,
    });
  };

  const handleAppLockToggle = (enabled: boolean) => {
    setAppLock(enabled);

    toast.success(`App Lock ${enabled ? 'Enabled' : 'Disabled'}`, {
      description: `The application ${enabled ? 'requires authentication to access' : 'is unlocked'}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Chat Lock */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="border-b border-gray-200 rounded-t-lg py-0">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Lock
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Secure Chat Access</h3>
              <p className="text-gray-600 mt-1">
                Require additional authentication to access chat conversations and messages.
              </p>
              <div className="mt-3">
                <Badge variant={chatLock ? "default" : "secondary"} className="mr-2">
                  {chatLock ? "Active" : "Inactive"}
                </Badge>
                {chatLock && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Chat conversations are protected
                  </span>
                )}
              </div>
            </div>
            <div className="ml-6">
              <Switch
                checked={chatLock}
                onCheckedChange={handleChatLockToggle}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          {chatLock && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Chat Lock Features:</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• Biometric authentication for chat access</li>
                    <li>• Auto-lock after inactivity</li>
                    <li>• Secure message previews</li>
                    <li>• End-to-end encryption indicators</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Lock */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="border-b border-gray-200 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            App Lock
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Application Security</h3>
              <p className="text-gray-600 mt-1">
                Lock the entire application and require authentication to access any features.
              </p>
              <div className="mt-3">
                <Badge variant={appLock ? "default" : "secondary"} className="mr-2">
                  {appLock ? "Active" : "Inactive"}
                </Badge>
                {appLock && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Application is secured
                  </span>
                )}
              </div>
            </div>
            <div className="ml-6">
              <Switch
                checked={appLock}
                onCheckedChange={handleAppLockToggle}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
          </div>

          {appLock && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900">App Lock Features:</h4>
                  <ul className="text-sm text-purple-800 mt-2 space-y-1">
                    <li>• PIN or biometric authentication</li>
                    <li>• Auto-lock timer configuration</li>
                    <li>• Failed attempt lockout</li>
                    <li>• Background app blur for privacy</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Configure Lock Settings
            </Button>
            <Button variant="outline" className="flex-1">
              Test Authentication
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Overview */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="rounded-t-lg border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900">Active Protections</h4>
              <ul className="text-sm text-green-800 mt-2 space-y-1">
                {appLock && <li>✓ App Lock enabled</li>}
                {chatLock && <li>✓ Chat Lock enabled</li>}
                <li>✓ Session timeout configured</li>
                <li>✓ Secure authentication</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900">Security Score</h4>
              <div className="mt-2">
                <div className="text-2xl font-bold text-blue-600">
                  {85 + (chatLock ? 10 : 0) + (appLock ? 5 : 0)}%
                </div>
                <p className="text-sm text-blue-800">Your account is well protected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};