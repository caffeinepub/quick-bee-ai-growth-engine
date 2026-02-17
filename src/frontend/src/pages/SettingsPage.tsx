import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useGetUserPayments } from '../hooks/usePayments';
import { useGetPaymentSettings, useUpdatePaymentSettings } from '../hooks/usePaymentSettings';
import { useIsCallerAdmin } from '../hooks/useAuthRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, CreditCard, Settings as SettingsIcon, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentsList } from '../components/payments/PaymentsList';
import { AppRole } from '../backend';

export default function SettingsPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { isLoading: paymentsLoading } = useGetUserPayments();
  const { data: paymentSettings, isLoading: paymentSettingsLoading } = useGetPaymentSettings();
  const updatePaymentSettings = useUpdatePaymentSettings();

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [mobileNumber, setMobileNumber] = useState(profile?.mobileNumber || '');
  const [agency, setAgency] = useState(profile?.agency || '');
  const [revenueGoal, setRevenueGoal] = useState(profile?.revenueGoal?.toString() || '0');

  const [upiDetails, setUpiDetails] = useState(paymentSettings?.upiDetails || '');
  const [razorpayLink, setRazorpayLink] = useState(paymentSettings?.razorpayLink || '');
  const [stripeLink, setStripeLink] = useState(paymentSettings?.stripeLink || '');

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setMobileNumber(profile.mobileNumber || '');
      setAgency(profile.agency);
      setRevenueGoal(profile.revenueGoal?.toString() || '0');
    }
  });

  // Update payment settings form when data loads
  useState(() => {
    if (paymentSettings) {
      setUpiDetails(paymentSettings.upiDetails);
      setRazorpayLink(paymentSettings.razorpayLink);
      setStripeLink(paymentSettings.stripeLink);
    }
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await saveProfile.mutateAsync({
        ...profile,
        name,
        email,
        mobileNumber: mobileNumber.trim() || undefined,
        agency,
        revenueGoal: BigInt(revenueGoal || '0'),
      });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePaymentSettings.mutateAsync({
        upiDetails,
        razorpayLink,
        stripeLink,
      });
      toast.success('Payment settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment settings');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and payment settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="payment-settings" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              Payment Settings
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and agency information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency Name</Label>
                    <Input
                      id="agency"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      placeholder="Your agency"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueGoal">Revenue Goal (₹)</Label>
                    <Input
                      id="revenueGoal"
                      type="number"
                      value={revenueGoal}
                      onChange={(e) => setRevenueGoal(e.target.value)}
                      placeholder="100000"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={profile?.role || AppRole.Client} disabled />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={saveProfile.isPending}>
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Orders</CardTitle>
              <CardDescription>View and manage your payment orders</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <PaymentsList />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="payment-settings">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Settings</CardTitle>
                <CardDescription>Configure payment gateway details for your agency</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentSettingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <form onSubmit={handleSavePaymentSettings} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiDetails">UPI Details</Label>
                      <Input
                        id="upiDetails"
                        value={upiDetails}
                        onChange={(e) => setUpiDetails(e.target.value)}
                        placeholder="yourname@upi"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your UPI ID for receiving payments
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="razorpayLink">Razorpay Payment Link</Label>
                      <Input
                        id="razorpayLink"
                        value={razorpayLink}
                        onChange={(e) => setRazorpayLink(e.target.value)}
                        placeholder="https://razorpay.me/@yourhandle"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your Razorpay payment link for Indian payments
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stripeLink">Stripe Payment Link</Label>
                      <Input
                        id="stripeLink"
                        value={stripeLink}
                        onChange={(e) => setStripeLink(e.target.value)}
                        placeholder="https://buy.stripe.com/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Your Stripe payment link for international payments
                      </p>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={updatePaymentSettings.isPending}>
                        {updatePaymentSettings.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Payment Settings'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
