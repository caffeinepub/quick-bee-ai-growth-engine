import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useGetPaymentSettings, useUpdatePaymentSettings } from '../hooks/usePaymentSettings';
import { useIsCallerAdmin } from '../hooks/useAuthRole';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Building, Phone, DollarSign, CreditCard, TrendingUp, Save, Smartphone, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { PaymentsList } from '../components/payments/PaymentsList';
import type { UserProfile, PaymentSettings } from '../backend';

export default function SettingsPage() {
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const { data: paymentSettings, isLoading: paymentSettingsLoading } = useGetPaymentSettings();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const saveProfile = useSaveCallerUserProfile();
  const updatePaymentSettings = useUpdatePaymentSettings();
  const { identity } = useInternetIdentity();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    agency: '',
    revenueGoal: '',
    subscriptionPlan: '',
  });

  const [paymentFormData, setPaymentFormData] = useState({
    upiDetails: '',
    razorpayLink: '',
    stripeLink: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPayments, setIsEditingPayments] = useState(false);

  // Initialize form when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        mobileNumber: profile.mobileNumber || '',
        agency: profile.agency || '',
        revenueGoal: profile.revenueGoal ? Number(profile.revenueGoal).toString() : '',
        subscriptionPlan: profile.subscriptionPlan || 'Free',
      });
    }
    if (paymentSettings) {
      setPaymentFormData({
        upiDetails: paymentSettings.upiDetails || '',
        razorpayLink: paymentSettings.razorpayLink || '',
        stripeLink: paymentSettings.stripeLink || '',
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  const isGuest = isFetched && !profile;

  const handleEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        mobileNumber: profile.mobileNumber || '',
        agency: profile.agency || '',
        revenueGoal: profile.revenueGoal ? Number(profile.revenueGoal).toString() : '',
        subscriptionPlan: profile.subscriptionPlan || 'Free',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        agency: '',
        revenueGoal: '0',
        subscriptionPlan: 'Free',
      });
    }
    setIsEditing(true);
  };

  const handleEditPayments = () => {
    if (paymentSettings) {
      setPaymentFormData({
        upiDetails: paymentSettings.upiDetails || '',
        razorpayLink: paymentSettings.razorpayLink || '',
        stripeLink: paymentSettings.stripeLink || '',
      });
    }
    setIsEditingPayments(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCancelPayments = () => {
    setIsEditingPayments(false);
  };

  const handleSave = async () => {
    try {
      const principal = identity?.getPrincipal().toString() || 'anonymous';
      
      const updatedProfile: UserProfile = {
        principal,
        name: formData.name || 'Guest',
        email: formData.email || '',
        mobileNumber: formData.mobileNumber || undefined,
        agency: formData.agency || 'Default Agency',
        role: profile?.role || 'guest',
        revenueGoal: formData.revenueGoal ? BigInt(formData.revenueGoal) : BigInt(0),
        subscriptionPlan: formData.subscriptionPlan || 'Free',
        totalRevenue: profile?.totalRevenue || BigInt(0),
      };

      await saveProfile.mutateAsync(updatedProfile);
      toast.success('Settings saved successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save settings');
    }
  };

  const handleSavePayments = async () => {
    try {
      const updatedSettings: PaymentSettings = {
        upiDetails: paymentFormData.upiDetails,
        razorpayLink: paymentFormData.razorpayLink,
        stripeLink: paymentFormData.stripeLink,
      };

      await updatePaymentSettings.mutateAsync(updatedSettings);
      toast.success('Payment settings saved successfully');
      setIsEditingPayments(false);
    } catch (error: any) {
      console.error('Save payment settings error:', error);
      toast.error(error.message || 'Failed to save payment settings');
    }
  };

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Manage your account and preferences</p>
      </div>

      {isGuest && !isEditing && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
          You are browsing as a guest. You can still edit and save your settings.
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {isAdmin && <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing && (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="Enter your mobile number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agency" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Agency
                    </Label>
                    <Input
                      id="agency"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                      placeholder="Enter your agency name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscription" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Subscription Plan
                    </Label>
                    <Input
                      id="subscription"
                      value={formData.subscriptionPlan}
                      onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                      placeholder="e.g., Free, Pro, Enterprise"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div>
                      <Badge>{profile?.role || 'guest'}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </Label>
                    <p className="text-sm">{profile?.name || 'Guest'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <p className="text-sm">{profile?.email || 'Not set'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile Number
                    </Label>
                    <p className="text-sm">{profile?.mobileNumber || 'Not set'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Agency
                    </Label>
                    <p className="text-sm">{profile?.agency || 'Not set'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div>
                      <Badge>{profile?.role || 'guest'}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Subscription Plan
                    </Label>
                    <p className="text-sm">{profile?.subscriptionPlan || 'Free'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="revenueGoal" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monthly Goal
                    </Label>
                    <Input
                      id="revenueGoal"
                      type="number"
                      value={formData.revenueGoal}
                      onChange={(e) => setFormData({ ...formData, revenueGoal: e.target.value })}
                      placeholder="Enter monthly revenue goal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Total Revenue
                    </Label>
                    <p className="text-2xl font-bold text-green-600">
                      ${profile?.totalRevenue ? Number(profile.totalRevenue).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monthly Goal
                    </Label>
                    <p className="text-2xl font-bold">
                      ${profile?.revenueGoal ? Number(profile.revenueGoal).toLocaleString() : '0'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Total Revenue
                    </Label>
                    <p className="text-2xl font-bold text-green-600">
                      ${profile?.totalRevenue ? Number(profile.totalRevenue).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel} disabled={saveProfile.isPending}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveProfile.isPending}>
                {saveProfile.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Payments</CardTitle>
              <CardDescription>View and track your payment orders</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsList />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="payment-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Configure payment gateway details for checkout</CardDescription>
                  </div>
                  {!isEditingPayments && (
                    <Button onClick={handleEditPayments} variant="outline" size="sm">
                      Edit Settings
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentSettingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading payment settings...</p>
                  </div>
                ) : isEditingPayments ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="upiDetails" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        UPI ID / VPA
                      </Label>
                      <Input
                        id="upiDetails"
                        value={paymentFormData.upiDetails}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, upiDetails: e.target.value })}
                        placeholder="yourname@upi or 9876543210@paytm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your UPI ID for receiving payments via Google Pay, PhonePe, Paytm, etc.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="razorpayLink" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Razorpay Payment Link
                      </Label>
                      <Input
                        id="razorpayLink"
                        value={paymentFormData.razorpayLink}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, razorpayLink: e.target.value })}
                        placeholder="https://razorpay.me/@yourhandle"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your Razorpay payment link for accepting cards, UPI, net banking, and wallets
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stripeLink" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Stripe Payment Link
                      </Label>
                      <Input
                        id="stripeLink"
                        value={paymentFormData.stripeLink}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, stripeLink: e.target.value })}
                        placeholder="https://buy.stripe.com/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your Stripe payment link for accepting international credit/debit cards
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        UPI ID / VPA
                      </Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {paymentSettings?.upiDetails || 'Not configured'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Razorpay Payment Link
                      </Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                        {paymentSettings?.razorpayLink || 'Not configured'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Stripe Payment Link
                      </Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                        {paymentSettings?.stripeLink || 'Not configured'}
                      </p>
                    </div>
                  </div>
                )}

                {isEditingPayments && (
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={handleCancelPayments} disabled={updatePaymentSettings.isPending}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePayments} disabled={updatePaymentSettings.isPending}>
                      {updatePaymentSettings.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
