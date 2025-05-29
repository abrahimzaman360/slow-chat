"use client";
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileManagement } from '@/components/settings/profile-management';
import { AccountManagement } from '@/components/settings/account-management';
import { SecuritySettings } from '@/components/settings/security-management';
import { PrivacySettings } from '@/components/settings/privacy-management';
import { User, Shield, Lock, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/lib/providers/auth-provider';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br py-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 shadow-sm">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileManagement currentUser={user!} />
          </TabsContent>

          <TabsContent value="account">
            <AccountManagement />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;