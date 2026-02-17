import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useDemoSession } from '../hooks/useDemoSession';
import { useSessionAppRole } from '../hooks/useSessionAppRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, User } from 'lucide-react';
import { AppRole } from '../backend';
import { UPLOADED_IMAGES } from '../constants/uploadedImages';
import { SafeImage } from '../components/common/SafeImage';

const DEMO_USERNAME = 'demo';
const DEMO_PASSWORD = 'demo123';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { startDemo, isDemoActive } = useDemoSession();
  const { selectedRole, setSelectedRole } = useSessionAppRole();

  const [demoUsername, setDemoUsername] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [demoError, setDemoError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  // Redirect if already authenticated or in demo mode
  useEffect(() => {
    if (identity || isDemoActive) {
      navigate({ to: '/' });
    }
  }, [identity, isDemoActive, navigate]);

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
      // After successful login, navigate to dashboard
      navigate({ to: '/' });
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError('');
    setDemoLoading(true);

    try {
      // Validate credentials
      if (!demoUsername || !demoPassword) {
        setDemoError('Please enter both username and password');
        return;
      }

      if (demoUsername !== DEMO_USERNAME || demoPassword !== DEMO_PASSWORD) {
        setDemoError('Invalid username or password');
        return;
      }

      // Start demo session
      await startDemo();
      
      // Navigate to dashboard
      navigate({ to: '/' });
    } catch (error: any) {
      console.error('Demo login error:', error);
      setDemoError('Failed to start demo session. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SafeImage
              src={UPLOADED_IMAGES.qbLogo}
              alt="Quick Bee"
              className="w-20 h-20 object-contain rounded-xl shadow-lg"
              fallback="QB"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Quick Bee</h1>
            <p className="text-muted-foreground mt-1">AI Growth Engine for Agencies</p>
          </div>
        </div>

        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Select Your Role
            </CardTitle>
            <CardDescription>Choose your access level before signing in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole || 'Client'}
                onValueChange={(value) => setSelectedRole(value as AppRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin - Full Access</SelectItem>
                  <SelectItem value="Manager">Manager - Operational Access</SelectItem>
                  <SelectItem value="Client">Client - Purchase & Projects</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedRole === 'Admin' && 'Full access to all features and settings'}
                {selectedRole === 'Manager' && 'Access to leads, outreach, deals, and operations'}
                {selectedRole === 'Client' && 'Access to dashboard, projects, and purchasing'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Internet Identity Login */}
        <Card>
          <CardHeader>
            <CardTitle>Internet Identity Login</CardTitle>
            <CardDescription>Secure authentication with Internet Identity</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleInternetIdentityLogin}
              disabled={isLoggingIn || !selectedRole}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Demo Login */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Demo Login (Limited Access)
            </CardTitle>
            <CardDescription>
              Try the app with limited functionality for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDemoLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-username">Username</Label>
                <Input
                  id="demo-username"
                  type="text"
                  value={demoUsername}
                  onChange={(e) => setDemoUsername(e.target.value)}
                  placeholder="demo"
                  disabled={demoLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-password">Password</Label>
                <Input
                  id="demo-password"
                  type="password"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  placeholder="demo123"
                  disabled={demoLoading}
                />
              </div>

              {demoError && (
                <Alert variant="destructive">
                  <AlertDescription>{demoError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                variant="outline"
                disabled={demoLoading || !selectedRole}
                className="w-full"
                size="lg"
              >
                {demoLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting demo...
                  </>
                ) : (
                  'Login as Demo User'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Demo credentials: username: <code className="font-mono">demo</code>, password:{' '}
                <code className="font-mono">demo123</code>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
