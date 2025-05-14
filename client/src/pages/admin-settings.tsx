import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Eye } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your system preferences and configuration.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure your system-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">System Name</Label>
                  <Input id="site-name" defaultValue="Meal Planning System" />
                  <p className="text-sm text-muted-foreground">
                    This name appears in page titles and the admin dashboard.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-meal-count">Default Meal Count</Label>
                  <Input id="default-meal-count" type="number" defaultValue="0" />
                  <p className="text-sm text-muted-foreground">
                    Default number of meals when creating a new meal submission.
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="auto-approve">Auto-approve Submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve meal submissions when created.
                    </p>
                  </div>
                  <Switch id="auto-approve" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new meal submissions.
                    </p>
                  </div>
                  <Switch id="email-notifications" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="submission-notifications">Submission Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when a new meal submission is created.
                    </p>
                  </div>
                  <Switch id="submission-notifications" defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="summary-notifications">Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of all meal submissions.
                    </p>
                  </div>
                  <Switch id="summary-notifications" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="two-factor">Two-factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a code from your authenticator app to log in.
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize how the system looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-full h-24 rounded-md border-2 border-primary bg-blue-600"></div>
                    <span className="text-sm">Blue</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-full h-24 rounded-md border-2 border-muted bg-green-600"></div>
                    <span className="text-sm">Green</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-full h-24 rounded-md border-2 border-muted bg-purple-600"></div>
                    <span className="text-sm">Purple</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a darker color theme.
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text-size">Default Text Size</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Small</span>
                    <Input 
                      id="text-size" 
                      type="range" 
                      className="w-full" 
                      defaultValue="50" 
                    />
                    <span className="text-sm">Large</span>
                  </div>
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}