import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetStripeConfiguration, useIsStripeConfigured } from '../../hooks/useStripeConfiguration';
import { useIsCallerAdmin } from '../../hooks/useAuthRole';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StripeConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StripeConfigurationDialog({ open, onOpenChange }: StripeConfigurationDialogProps) {
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: isConfigured = false } = useIsStripeConfigured();
  const setConfiguration = useSetStripeConfiguration();
  
  const [formData, setFormData] = useState({
    secretKey: '',
    allowedCountries: 'US,CA,GB,AU,IN',
  });

  useEffect(() => {
    if (isConfigured) {
      onOpenChange(false);
    }
  }, [isConfigured, onOpenChange]);

  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.secretKey) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    if (!formData.allowedCountries) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      const countries = formData.allowedCountries
        .split(',')
        .map(c => c.trim().toUpperCase())
        .filter(c => c.length === 2);

      if (countries.length === 0) {
        toast.error('Please enter valid 2-letter country codes (e.g., US, CA, GB)');
        return;
      }

      await setConfiguration.mutateAsync({
        secretKey: formData.secretKey,
        allowedCountries: countries,
      });
      
      toast.success('Stripe configured successfully');
      onOpenChange(false);
      setFormData({
        secretKey: '',
        allowedCountries: 'US,CA,GB,AU,IN',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure Stripe');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Stripe Payment</DialogTitle>
          <DialogDescription>
            Set up your Stripe integration to accept international payments
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin only: This configuration is required before users can make Stripe payments.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="secretKey">Stripe Secret Key *</Label>
              <Input
                id="secretKey"
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                placeholder="sk_test_..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Get your secret key from the Stripe Dashboard
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allowedCountries">Allowed Countries *</Label>
              <Input
                id="allowedCountries"
                value={formData.allowedCountries}
                onChange={(e) => setFormData({ ...formData, allowedCountries: e.target.value })}
                placeholder="US,CA,GB,AU,IN"
                required
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated 2-letter country codes (e.g., US, CA, GB, AU, IN)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={setConfiguration.isPending}>
              {setConfiguration.isPending ? 'Configuring...' : 'Configure Stripe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
