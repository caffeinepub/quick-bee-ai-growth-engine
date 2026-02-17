import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';
import { CheckoutDialog } from '../components/payments/CheckoutDialog';
import { ServiceNiche3dIcon } from '../components/common/ServiceNiche3dIcon';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  serviceType: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'website',
    name: 'Professional Website',
    price: 15000,
    description: 'Complete website solution for your business',
    serviceType: 'website',
    features: [
      'Custom responsive design',
      'Up to 5 pages',
      'Contact form integration',
      'SEO optimization',
      'Mobile-friendly',
      '1 month support',
    ],
  },
  {
    id: 'whatsapp-automation',
    name: 'WhatsApp Automation',
    price: 8000,
    description: 'Automate your customer communication',
    serviceType: 'whatsapp-automation',
    features: [
      'Auto-reply setup',
      'Broadcast messages',
      'Contact management',
      'Analytics dashboard',
      'Template messages',
      'Integration support',
    ],
    popular: true,
  },
  {
    id: 'lead-machine',
    name: 'Lead Generation Machine',
    price: 12000,
    description: 'Generate quality leads for your business',
    serviceType: 'lead-machine',
    features: [
      'Multi-channel campaigns',
      'Lead capture forms',
      'CRM integration',
      'Email automation',
      'Performance tracking',
      'Monthly reports',
    ],
  },
  {
    id: 'personal-brand',
    name: 'Personal Brand Package',
    price: 20000,
    description: 'Build your personal brand online',
    serviceType: 'personal-brand',
    features: [
      'Brand strategy',
      'Social media setup',
      'Content calendar',
      'Profile optimization',
      'Engagement tactics',
      '3 months guidance',
    ],
  },
  {
    id: 'ai-growth',
    name: 'AI Growth Suite',
    price: 25000,
    description: 'AI-powered growth solutions',
    serviceType: 'ai-growth',
    features: [
      'AI chatbot integration',
      'Predictive analytics',
      'Automated workflows',
      'Smart recommendations',
      'Performance optimization',
      'Ongoing AI training',
    ],
  },
];

const maintenanceTier: PricingTier = {
  id: 'maintenance',
  name: 'Monthly Maintenance',
  price: 3000,
  description: 'Keep your digital assets running smoothly',
  serviceType: 'maintenance',
  features: [
    'Regular updates',
    'Security monitoring',
    'Performance optimization',
    'Content updates',
    'Technical support',
    'Monthly reports',
  ],
};

export default function ServicesPricingPage() {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleCheckout = (tier: PricingTier) => {
    setSelectedTier(tier);
    setCheckoutDialogOpen(true);
  };

  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Services & Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the perfect service package for your business needs
        </p>
      </div>

      {/* Main Service Tiers */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card key={tier.id} className={tier.popular ? 'border-primary shadow-lg' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <ServiceNiche3dIcon
                  variant="service"
                  service={{ serviceType: tier.serviceType }}
                  size={48}
                  className="rounded-lg"
                />
                {tier.popular && (
                  <Badge className="bg-primary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{formatINR(tier.price)}</span>
                <span className="text-muted-foreground ml-1">one-time</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={tier.popular ? 'default' : 'outline'}
                onClick={() => handleCheckout(tier)}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Maintenance Package */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <ServiceNiche3dIcon
                variant="service"
                service={{ serviceType: maintenanceTier.serviceType }}
                size={56}
                className="rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <CardTitle className="text-2xl">{maintenanceTier.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {maintenanceTier.description}
                </CardDescription>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{formatINR(maintenanceTier.price)}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-2">
                {maintenanceTier.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {maintenanceTier.features.slice(3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={() => handleCheckout(maintenanceTier)}
            >
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedTier && (
        <CheckoutDialog
          open={checkoutDialogOpen}
          onOpenChange={setCheckoutDialogOpen}
          serviceId={selectedTier.id}
          serviceName={selectedTier.name}
          amount={selectedTier.price}
        />
      )}
    </div>
  );
}
