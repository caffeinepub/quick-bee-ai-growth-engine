import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface PricingTier {
  name: string;
  price: number;
  features: string[];
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  tiers: PricingTier[];
}

interface MaintenancePlan {
  name: string;
  price: number;
  features: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'website-launch',
    name: 'Quick Website Launch',
    description: 'Professional websites built fast',
    tiers: [
      {
        name: 'Basic',
        price: 2999,
        features: [
          '1-page responsive website',
          'Contact form',
          'WhatsApp button',
          '5-day delivery',
        ],
      },
      {
        name: 'Pro',
        price: 5999,
        features: [
          '5-page website',
          'Custom layout',
          'Basic SEO',
          '1 month support',
        ],
      },
      {
        name: 'Premium',
        price: 9999,
        features: [
          '8–10 pages',
          'Lead capture system',
          'Blog setup',
          '2 months support',
        ],
      },
    ],
  },
  {
    id: 'whatsapp-automation',
    name: 'WhatsApp Automation System',
    description: 'Automate your WhatsApp communication',
    tiers: [
      {
        name: 'Basic',
        price: 1999,
        features: [
          'Auto greeting',
          'Menu reply flow',
        ],
      },
      {
        name: 'Pro',
        price: 4999,
        features: [
          'Lead capture automation',
          'Auto follow-up',
          'Google Sheet integration',
        ],
      },
      {
        name: 'Premium',
        price: 8999,
        features: [
          'Smart chatbot flow',
          'Appointment booking',
          'Payment link integration',
        ],
      },
    ],
  },
  {
    id: 'lead-machine',
    name: 'Lead Machine Setup',
    description: 'Convert visitors into qualified leads',
    tiers: [
      {
        name: 'Basic',
        price: 3999,
        features: [
          '1 landing page',
          'Lead form',
          'WhatsApp integration',
        ],
      },
      {
        name: 'Pro',
        price: 7999,
        features: [
          'Funnel page',
          'Email automation',
          'Lead tracking sheet',
        ],
      },
      {
        name: 'Premium',
        price: 14999,
        features: [
          'Multi-step funnel',
          'Automation sequence',
          'CRM setup',
        ],
      },
    ],
  },
  {
    id: 'personal-brand',
    name: 'Personal Brand Starter Kit',
    description: 'Build your personal brand online',
    tiers: [
      {
        name: 'Basic',
        price: 1499,
        features: [
          'Bio optimization',
          'Profile structure',
        ],
      },
      {
        name: 'Pro',
        price: 3999,
        features: [
          '30-day content plan',
          'DM automation setup',
        ],
      },
      {
        name: 'Premium',
        price: 7999,
        features: [
          'Instagram growth system',
          'Funnel setup',
          'WhatsApp automation',
        ],
      },
    ],
  },
  {
    id: 'ai-growth-kit',
    name: 'Mini AI Growth Kit',
    description: 'Complete AI-powered growth solution',
    tiers: [
      {
        name: 'Basic',
        price: 4999,
        features: [
          'Website + WhatsApp auto reply',
        ],
      },
      {
        name: 'Pro',
        price: 9999,
        features: [
          'Website + Funnel + Automation',
        ],
      },
      {
        name: 'Premium',
        price: 19999,
        features: [
          'Website',
          'Funnel',
          'WhatsApp automation',
          'CRM setup',
          'Basic AI chatbot',
        ],
      },
    ],
  },
];

const maintenancePlans: MaintenancePlan[] = [
  {
    name: 'Student',
    price: 499,
    features: [
      'Minor updates',
      'Basic support',
      'System monitoring',
    ],
  },
  {
    name: 'Business',
    price: 999,
    features: [
      'Minor updates',
      'Basic support',
      'System monitoring',
    ],
  },
  {
    name: 'Pro',
    price: 1999,
    features: [
      'Minor updates',
      'Basic support',
      'System monitoring',
    ],
  },
];

const faqs = [
  {
    question: 'What is the typical delivery time?',
    answer: 'Delivery times vary by service and tier. Basic packages typically deliver within 5-7 days, Pro packages within 7-14 days, and Premium packages within 14-21 days. Exact delivery times are specified in each service tier.',
  },
  {
    question: 'What payment options do you accept?',
    answer: 'We accept multiple payment methods including UPI, Razorpay, and Stripe. You can pay via UPI for instant transfers, or use credit/debit cards through Razorpay and Stripe for secure online payments.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'All packages include dedicated support via WhatsApp and email. Support duration varies by tier - Basic includes 1 week, Pro includes 1 month, and Premium includes 2-3 months of post-delivery support. Monthly maintenance plans provide ongoing support.',
  },
];

export default function ServicesPricingPage() {
  const [selectedMaintenance, setSelectedMaintenance] = useState<string>('Student');

  const handleSelectPlan = (categoryName: string, tierName: string) => {
    toast.success(`Selected ${categoryName} - ${tierName} plan`);
  };

  const handleGetStarted = (categoryName: string, tierName: string) => {
    toast.success(`Getting started with ${categoryName} - ${tierName}`);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Services & Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Affordable, productized services for students and small businesses. Scale your growth with Quick Bee AI Growth Engine.
        </p>
      </div>

      {/* Service Categories */}
      {serviceCategories.map((category) => (
        <section key={category.id} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {category.tiers.map((tier) => (
              <Card
                key={tier.name}
                className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50"
              >
                {tier.name === 'Pro' && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold tracking-tight">
                      {formatPrice(tier.price)}
                    </div>
                    <CardDescription>One-time payment</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleSelectPlan(category.name, tier.name)}
                    >
                      Select Plan
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleGetStarted(category.name, tier.name)}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Monthly Maintenance Plans */}
      <section className="space-y-6 bg-accent/30 rounded-2xl p-8 md:p-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Monthly Maintenance Plans</h2>
          <p className="text-muted-foreground">Keep your systems running smoothly with ongoing support</p>
        </div>

        <Tabs value={selectedMaintenance} onValueChange={setSelectedMaintenance} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            {maintenancePlans.map((plan) => (
              <TabsTrigger key={plan.name} value={plan.name}>
                {plan.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {maintenancePlans.map((plan) => (
            <TabsContent key={plan.name} value={plan.name} className="mt-8">
              <Card className="max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name} Plan</CardTitle>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold tracking-tight">
                      {formatPrice(plan.price)}
                    </div>
                    <CardDescription>per month</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1 text-center">
                    <p className="font-semibold">Includes:</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleSelectPlan('Maintenance', plan.name)}
                    >
                      Select Plan
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleGetStarted('Maintenance', plan.name)}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about our services</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer Attribution */}
      <footer className="text-center pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Quick Bee AI Growth Engine. Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'quickbee-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
