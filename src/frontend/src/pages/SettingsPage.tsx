import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useGetPaymentSettings, useUpdatePaymentSettings } from '../hooks/usePaymentSettings';
import { useIsCallerAdmin } from '../hooks/useAuthRole';
import { useIsStripeConfigured } from '../hooks/useStripeConfiguration';
import { PaymentsList } from '../components/payments/PaymentsList';
import { StripeConfigurationDialog } from '../components/payments/StripeConfigurationDialog';
import { AppRole } from '../backend';
import { toast } from 'sonner';
import { User, CreditCard, Settings as SettingsIcon, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: paymentSettings } = useGetPaymentSettings();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: isStripeConfigured = false } = useIsStripeConfigured();
  const saveProfile = useSaveCallerUserProfile();
  const updatePaymentSettings = useUpdatePaymentSettings();
  
  const [stripeDialogOpen, setStripeDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    agency: '',
    revenueGoal: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    upiDetails: '',
    razorpayLink: '',
    stripeLink: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        email: profile.email,
        mobileNumber: profile.mobileNumber || '',
        agency: profile.agency,
        revenueGoal: Number(profile.revenueGoal).toString(),
      });
    }
  }, [profile]);

  useEffect(() => {
    if (paymentSettings) {
      setPaymentForm({
        upiDetails: paymentSettings.upiDetails,
        razorpayLink: paymentSettings.razorpayLink,
        stripeLink: paymentSettings.stripeLink,
      });
    }
  }, [paymentSettings]);

  const handleProfileSave = async () => {
    if (!profile) return;

    try {
      await saveProfile.mutateAsync({
        ...profile,
        name: profileForm.name,
        email: profileForm.email,
        mobileNumber: profileForm.mobileNumber || undefined,
        agency: profileForm.agency,
        revenueGoal: BigInt(profileForm.revenueGoal || 0),
      });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePaymentSettingsSave = async () => {
    try {
      await updatePaymentSettings.mutateAsync(paymentForm);
      toast.success('Payment settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment settings');
    }
  };

  const getRoleLabel = (role?: AppRole) => {
    if (!role) return 'Client';
    switch (role) {
      case AppRole.Admin:
        return 'Admin';
      case AppRole.Manager:
        return 'Manager';
      case AppRole.Client:
        return 'Client';
      case AppRole.Demo:
        return 'Demo';
      default:
        return 'Client';
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and payment preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="payment-settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Payment Settings
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Role</Label>
                <div>
                  <Badge variant="outline">{getRoleLabel(profile?.role)}</Badge>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profileForm.mobileNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, mobileNumber: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="agency">Agency</Label>
                <Input
                  id="agency"
                  value={profileForm.agency}
                  onChange={(e) => setProfileForm({ ...profileForm, agency: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="revenueGoal">Revenue Goal (₹)</Label>
                <Input
                  id="revenueGoal"
                  type="number"
                  value={profileForm.revenueGoal}
                  onChange={(e) => setProfileForm({ ...profileForm, revenueGoal: e.target.value })}
                />
              </div>

              <Button onClick={handleProfileSave} disabled={saveProfile.isPending}>
                {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and manage your payment orders</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsList />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="payment-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Configuration</CardTitle>
                <CardDescription>Configure Stripe for international payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Stripe Status</p>
                    <p className="text-sm text-muted-foreground">
                      {isStripeConfigured ? 'Configured and ready' : 'Not configured'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isStripeConfigured && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <Button 
                      variant={isStripeConfigured ? 'outline' : 'default'}
                      onClick={() => setStripeDialogOpen(true)}
                    >
                      {isStripeConfigured ? 'Reconfigure' : 'Configure Stripe'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Settings</CardTitle>
                <CardDescription>Configure UPI and Razorpay payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="upiDetails">UPI ID</Label>
                  <Input
                    id="upiDetails"
                    value={paymentForm.upiDetails}
                    onChange={(e) => setPaymentForm({ ...paymentForm, upiDetails: e.target.value })}
                    placeholder="yourname@upi"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="razorpayLink">Razorpay Payment Link</Label>
                  <Input
                    id="razorpayLink"
                    value={paymentForm.razorpayLink}
                    onChange={(e) => setPaymentForm({ ...paymentForm, razorpayLink: e.target.value })}
                    placeholder="https://razorpay.com/..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stripeLink">Stripe Payment Link (Optional)</Label>
                  <Input
                    id="stripeLink"
                    value={paymentForm.stripeLink}
                    onChange={(e) => setPaymentForm({ ...paymentForm, stripeLink: e.target.value })}
                    placeholder="https://stripe.com/..."
                  />
                </div>

                <Button onClick={handlePaymentSettingsSave} disabled={updatePaymentSettings.isPending}>
                  {updatePaymentSettings.isPending ? 'Saving...' : 'Save Payment Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <StripeConfigurationDialog open={stripeDialogOpen} onOpenChange={setStripeDialogOpen} />
    </div>
  );
}
