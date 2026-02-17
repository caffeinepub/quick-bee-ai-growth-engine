import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building, Phone, DollarSign, CreditCard, TrendingUp, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { UserProfile } from '../backend';

export default function SettingsPage() {
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { identity } = useInternetIdentity();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    agency: '',
    revenueGoal: '',
    subscriptionPlan: '',
  });

  const [isEditing, setIsEditing] = useState(false);

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
      // Guest defaults
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

  const handleCancel = () => {
    setIsEditing(false);
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
    </div>
  );
}
