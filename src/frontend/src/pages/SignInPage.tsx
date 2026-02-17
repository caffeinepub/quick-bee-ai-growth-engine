import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { setSignInIdentifier } from '../utils/signInIdentifier';

export default function SignInPage() {
  const { login, loginStatus } = useInternetIdentity();
  const [identifier, setIdentifier] = useState('');

  const isLoggingIn = loginStatus === 'logging-in';

  const handleSignIn = async () => {
    // Store the identifier before starting authentication
    if (identifier.trim()) {
      setSignInIdentifier(identifier.trim());
    }
    await login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-4">
          <img
            src="/assets/generated/quickbee-logo.dim_512x512.png"
            alt="Quick Bee"
            className="w-24 h-24 mx-auto"
          />
          <h1 className="text-4xl font-bold tracking-tight">Quick Bee</h1>
          <p className="text-lg text-muted-foreground">AI Growth Engine for Digital Agencies</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 bg-card p-6 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or mobile number</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="your@email.com or +1234567890"
                disabled={isLoggingIn}
              />
              <p className="text-xs text-muted-foreground">
                This will be used to prefill your profile. Authentication continues via Internet Identity.
              </p>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Continue with Internet Identity'
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Secure authentication powered by Internet Computer
          </p>
        </div>
      </div>
    </div>
  );
}
