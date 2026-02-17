import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useRegisterUser } from '../../hooks/useCurrentUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AppRole } from '../../backend';
import { getSignInIdentifier, prefillFromIdentifier } from '../../utils/signInIdentifier';

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
  const [role, setRole] = useState<AppRole>(AppRole.Client);

  // Prefill email or mobile from stored sign-in identifier
  useEffect(() => {
    const storedIdentifier = getSignInIdentifier();
    if (storedIdentifier) {
      const { email: prefillEmail, mobileNumber: prefillMobile } = prefillFromIdentifier(storedIdentifier);
      if (prefillEmail) {
        setEmail(prefillEmail);
      }
      if (prefillMobile) {
        setMobileNumber(prefillMobile);
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

    await registerUser.mutateAsync({
      name,
      email,
      mobileNumber: mobileNumber.trim() || undefined,
      agency,
      role,
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile number (optional)</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agency">Agency Name *</Label>
            <Input
              id="agency"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="My Agency"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AppRole.Client}>Client</SelectItem>
                <SelectItem value={AppRole.Manager}>Manager</SelectItem>
                <SelectItem value={AppRole.Admin}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Skip for now
            </Button>
            <Button type="submit" disabled={registerUser.isPending} className="flex-1">
              {registerUser.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
