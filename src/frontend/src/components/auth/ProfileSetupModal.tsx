import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useRegisterUser } from '../../hooks/useCurrentUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lock } from 'lucide-react';
import { UserRole } from '../../backend';
import { getSignInIdentifier, prefillFromIdentifier } from '../../utils/signInIdentifier';
import { isAdminAllowlisted, getAdminPrefillData } from '../../utils/adminAllowlist';

interface ProfileSetupModalProps {
  open?: boolean;
  onClose?: () => void;
}

export default function ProfileSetupModal({ open = true, onClose }: ProfileSetupModalProps) {
  const { identity } = useInternetIdentity();
  const registerUser = useRegisterUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [agency, setAgency] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [revenueGoal, setRevenueGoal] = useState('10000');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Starter');
  const [isAdminLocked, setIsAdminLocked] = useState(false);

  // Prefill email or mobile from stored sign-in identifier
  useEffect(() => {
    const storedIdentifier = getSignInIdentifier();
    if (storedIdentifier) {
      // Check if this is an admin allowlisted identifier
      const adminData = getAdminPrefillData(storedIdentifier);
      
      if (adminData) {
        // Prefill admin data and lock role to admin
        setName(adminData.name);
        setEmail(adminData.email);
        setMobileNumber(adminData.mobileNumber);
        setRole('admin');
        setIsAdminLocked(true);
      } else {
        // Regular user - prefill from identifier
        const { email: prefillEmail, mobileNumber: prefillMobile } = prefillFromIdentifier(storedIdentifier);
        if (prefillEmail) {
          setEmail(prefillEmail);
        }
        if (prefillMobile) {
          setMobileNumber(prefillMobile);
        }
        // Non-admin users cannot select admin role
        setRole('user');
      }
    }
  }, []);

  // Only show modal if authenticated
  if (!identity) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const principal = identity.getPrincipal().toString();
    const userRole: UserRole = role === 'admin' ? UserRole.admin : UserRole.user;

    await registerUser.mutateAsync({
      principal,
      name,
      email,
      mobileNumber: mobileNumber.trim() || null,
      agency,
      role: userRole,
      revenueGoal: BigInt(Math.floor(parseFloat(revenueGoal) || 0)),
      subscriptionPlan,
    });

    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Quick Bee!</DialogTitle>
          <DialogDescription>Let's set up your profile to get started.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={isAdminLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@agency.com"
              required
              disabled={isAdminLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile number (optional)</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+1234567890"
              disabled={isAdminLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agency">Agency Name *</Label>
            <Input
              id="agency"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="My Digital Agency"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            {isAdminLocked ? (
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Admin</span>
              </div>
            ) : (
              <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'user')}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Team Member</SelectItem>
                </SelectContent>
              </Select>
            )}
            {isAdminLocked && (
              <p className="text-xs text-muted-foreground">
                Admin role assigned based on allowlisted credentials
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueGoal">Monthly Revenue Goal ($) *</Label>
            <Input
              id="revenueGoal"
              type="number"
              value={revenueGoal}
              onChange={(e) => setRevenueGoal(e.target.value)}
              placeholder="10000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Subscription Plan *</Label>
            <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan}>
              <SelectTrigger id="plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Agency">Agency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Skip for now
            </Button>
            <Button type="submit" className="flex-1" disabled={registerUser.isPending}>
              {registerUser.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
