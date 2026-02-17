import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useIsCallerAdmin } from '../hooks/useAuthRole';
import AdminOnlySection from '../components/admin/AdminOnlySection';
import ClientServiceRequestsAdminPanel from '../components/admin/ClientServiceRequestsAdminPanel';

export default function SettingsPage() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={profile?.name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Mobile number</Label>
              <Input value={profile?.mobileNumber || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Agency</Label>
              <Input value={profile?.agency || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={profile?.role || ''} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Store your API keys securely</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                disabled
              />
              <p className="text-xs text-muted-foreground">
                API key storage will be available in a future update
              </p>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Admin-only settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <Input value={profile?.subscriptionPlan || ''} disabled />
              </div>
              <Button variant="outline" disabled>
                Manage Subscription
              </Button>
              <p className="text-xs text-muted-foreground">
                Stripe integration coming soon
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      <div className="max-w-4xl">
        <AdminOnlySection>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
              <p className="text-muted-foreground">Manage client service requests</p>
            </div>
            <ClientServiceRequestsAdminPanel />
          </div>
        </AdminOnlySection>
      </div>
    </div>
  );
}
