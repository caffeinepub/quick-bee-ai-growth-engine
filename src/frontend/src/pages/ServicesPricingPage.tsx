import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { CheckoutDialog } from '../components/payments/CheckoutDialog';
import { ServiceNiche3dIcon } from '../components/common/ServiceNiche3dIcon';

interface PricingOffering {
  id: string;
  name: string;
  price: number;
  features: string[];
  categoryKey: string;
  deliveryTime?: string;
}

interface PricingSection {
  title: string;
  categoryKey: string;
  offerings: PricingOffering[];
}

const pricingSections: PricingSection[] = [
  {
    title: 'Website Packages',
    categoryKey: 'website-packages',
    offerings: [
      {
        id: 'one-page-website',
        name: 'One-Page Website Starter',
        price: 1999,
        categoryKey: 'website-packages',
        deliveryTime: '3–5 days',
        features: [
          '1-page responsive website',
          'Contact form',
          'WhatsApp button',
          '3–5 days delivery',
        ],
      },
      {
        id: 'business-website-lite',
        name: 'Business Website Lite',
        price: 4999,
        categoryKey: 'website-packages',
        features: [
          '3–5 pages',
          'Mobile responsive',
          'Basic SEO',
          'Social links integration',
        ],
      },
      {
        id: 'website-pro-launch',
        name: 'Website Pro Launch',
        price: 8999,
        categoryKey: 'website-packages',
        features: [
          '8–10 pages',
          'Lead capture form',
          'Blog setup',
          'Basic speed optimization',
        ],
      },
    ],
  },
  {
    title: 'WhatsApp Automation',
    categoryKey: 'whatsapp-automation-packages',
    offerings: [
      {
        id: 'auto-reply-setup',
        name: 'Auto Reply Setup',
        price: 1499,
        categoryKey: 'whatsapp-automation-packages',
        features: [
          'Greeting message',
          'Menu reply system',
        ],
      },
      {
        id: 'lead-capture-flow',
        name: 'Lead Capture Flow',
        price: 3999,
        categoryKey: 'whatsapp-automation-packages',
        features: [
          'Auto lead collection',
          'Basic follow-up messages',
          'Google Sheet connection',
        ],
      },
      {
        id: 'smart-whatsapp-system',
        name: 'Smart WhatsApp System',
        price: 7999,
        categoryKey: 'whatsapp-automation-packages',
        features: [
          'Lead qualification',
          'Appointment booking',
          'Payment link integration',
        ],
      },
    ],
  },
  {
    title: 'Lead Generation Systems',
    categoryKey: 'lead-generation-systems',
    offerings: [
      {
        id: 'basic-landing-page',
        name: 'Basic Landing Page',
        price: 2999,
        categoryKey: 'lead-generation-systems',
        features: [
          '1 conversion page',
          'Lead form',
          'WhatsApp integration',
        ],
      },
      {
        id: 'funnel-starter',
        name: 'Funnel Starter',
        price: 6999,
        categoryKey: 'lead-generation-systems',
        features: [
          'Multi-section funnel',
          'Email collection',
          'Thank you page',
        ],
      },
      {
        id: 'funnel-pro-automation',
        name: 'Funnel Pro Automation',
        price: 12999,
        categoryKey: 'lead-generation-systems',
        features: [
          'Full funnel',
          'Email automation',
          'Lead tracking sheet',
        ],
      },
    ],
  },
  {
    title: 'Personal Brand Services',
    categoryKey: 'personal-brand-services',
    offerings: [
      {
        id: 'instagram-profile-optimization',
        name: 'Instagram Profile Optimization',
        price: 1499,
        categoryKey: 'personal-brand-services',
        features: [
          'Bio rewrite',
          'Profile structure',
        ],
      },
      {
        id: '30-day-content-plan',
        name: '30-Day Content Plan',
        price: 2999,
        categoryKey: 'personal-brand-services',
        features: [
          '30 content ideas',
          'Caption templates',
        ],
      },
      {
        id: 'instagram-growth-starter',
        name: 'Instagram Growth Starter',
        price: 6999,
        categoryKey: 'personal-brand-services',
        features: [
          'DM automation',
          'Lead capture flow',
          'Basic funnel setup',
        ],
      },
    ],
  },
  {
    title: 'SEO Services',
    categoryKey: 'seo-services',
    offerings: [
      {
        id: 'google-business-setup',
        name: 'Google Business Setup',
        price: 1999,
        categoryKey: 'seo-services',
        features: [
          'Profile optimization',
          'Keyword setup',
        ],
      },
      {
        id: 'local-seo-starter',
        name: 'Local SEO Starter',
        price: 4999,
        categoryKey: 'seo-services',
        features: [
          'On-page SEO',
          'Meta optimization',
        ],
      },
      {
        id: 'seo-growth-plan',
        name: 'SEO Growth Plan',
        price: 9999,
        categoryKey: 'seo-services',
        features: [
          'Technical fixes',
          '10 keywords optimization',
        ],
      },
    ],
  },
  {
    title: 'AI & Automation',
    categoryKey: 'ai-automation',
    offerings: [
      {
        id: 'faq-chatbot',
        name: 'FAQ Chatbot',
        price: 2999,
        categoryKey: 'ai-automation',
        features: [
          'Basic Q&A bot',
        ],
      },
      {
        id: 'ai-lead-bot',
        name: 'AI Lead Bot',
        price: 6999,
        categoryKey: 'ai-automation',
        features: [
          'Lead collection',
          'Smart replies',
        ],
      },
      {
        id: 'mini-ai-business-automation',
        name: 'Mini AI Business Automation',
        price: 14999,
        categoryKey: 'ai-automation',
        features: [
          'Website',
          'Funnel',
          'WhatsApp automation',
          'Basic CRM',
        ],
      },
    ],
  },
  {
    title: 'Business Systems',
    categoryKey: 'business-systems',
    offerings: [
      {
        id: 'crm-setup-basic',
        name: 'CRM Setup Basic',
        price: 3999,
        categoryKey: 'business-systems',
        features: [
          'Contact management',
          'Pipeline setup',
        ],
      },
      {
        id: 'crm-automation-pro',
        name: 'CRM Automation Pro',
        price: 9999,
        categoryKey: 'business-systems',
        features: [
          'Workflow automation',
          'Follow-up sequences',
        ],
      },
      {
        id: 'proposal-template-system',
        name: 'Proposal Template System',
        price: 2499,
        categoryKey: 'business-systems',
        features: [
          'Ready-to-use proposal templates',
        ],
      },
    ],
  },
  {
    title: 'Outreach Systems',
    categoryKey: 'outreach-systems',
    offerings: [
      {
        id: 'cold-email-starter',
        name: 'Cold Email Starter',
        price: 2999,
        categoryKey: 'outreach-systems',
        features: [
          '3 email templates',
          'Lead tracking sheet',
        ],
      },
      {
        id: 'linkedin-outreach-starter',
        name: 'LinkedIn Outreach Starter',
        price: 4999,
        categoryKey: 'outreach-systems',
        features: [
          'Profile optimization',
          '5 message templates',
        ],
      },
      {
        id: 'multi-channel-outreach-kit',
        name: 'Multi-Channel Outreach Kit',
        price: 9999,
        categoryKey: 'outreach-systems',
        features: [
          'Email + LinkedIn + WhatsApp templates',
          'Tracking sheet',
        ],
      },
    ],
  },
  {
    title: 'E-commerce',
    categoryKey: 'ecommerce',
    offerings: [
      {
        id: 'mini-store-setup',
        name: 'Mini Store Setup',
        price: 4999,
        categoryKey: 'ecommerce',
        features: [
          '5 products',
          'Payment gateway integration',
        ],
      },
      {
        id: 'ecommerce-growth-store',
        name: 'E-commerce Growth Store',
        price: 12999,
        categoryKey: 'ecommerce',
        features: [
          '20 products',
          'Funnel integration',
        ],
      },
    ],
  },
  {
    title: 'Student Special Packages',
    categoryKey: 'student-packages',
    offerings: [
      {
        id: 'student-entrepreneur-kit',
        name: 'Student Entrepreneur Kit',
        price: 3999,
        categoryKey: 'student-packages',
        features: [
          '1-page website',
          'WhatsApp automation',
        ],
      },
      {
        id: 'creator-launch-kit',
        name: 'Creator Launch Kit',
        price: 5999,
        categoryKey: 'student-packages',
        features: [
          'Website',
          'Funnel',
          'Instagram setup',
        ],
      },
      {
        id: 'coaching-starter-kit',
        name: 'Coaching Starter Kit',
        price: 7999,
        categoryKey: 'student-packages',
        features: [
          'Landing page',
          'Payment integration',
          'Lead automation',
        ],
      },
    ],
  },
  {
    title: 'Complete Low-Ticket Growth Engine',
    categoryKey: 'all-in-one-growth-kit',
    offerings: [
      {
        id: 'all-in-one-starter-growth-kit',
        name: 'All-in-One Starter Growth Kit',
        price: 19999,
        categoryKey: 'all-in-one-growth-kit',
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

const maintenancePlans: PricingOffering[] = [
  {
    id: 'maintenance-student',
    name: 'Student',
    price: 499,
    categoryKey: 'maintenance-plans',
    features: [
      'Minor updates',
      'Basic support',
      'Monitoring',
    ],
  },
  {
    id: 'maintenance-business',
    name: 'Business',
    price: 999,
    categoryKey: 'maintenance-plans',
    features: [
      'Minor updates',
      'Basic support',
      'Monitoring',
    ],
  },
  {
    id: 'maintenance-pro',
    name: 'Pro',
    price: 1999,
    categoryKey: 'maintenance-plans',
    features: [
      'Minor updates',
      'Basic support',
      'Monitoring',
    ],
  },
];

export default function ServicesPricingPage() {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<PricingOffering | null>(null);

  const handleCheckout = (offering: PricingOffering) => {
    setSelectedOffering(offering);
    setCheckoutDialogOpen(true);
  };

  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header with gradient background */}
      <div className="gradient-header text-center space-y-3 py-12 px-4 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Services & Pricing</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect service package for your business needs
        </p>
      </div>

      {/* All Service Sections */}
      {pricingSections.map((section) => (
        <section key={section.categoryKey} className="space-y-6">
          <div className="flex items-center gap-4">
            <ServiceNiche3dIcon
              variant="service"
              service={{ serviceType: section.categoryKey }}
              size={56}
              className="rounded-xl gradient-icon-border"
            />
            <h2 className="text-3xl font-bold tracking-tight">{section.title}</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.offerings.map((offering) => (
              <Card key={offering.id} className="gradient-card-border hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <ServiceNiche3dIcon
                      variant="service"
                      service={{ serviceType: offering.categoryKey }}
                      size={48}
                      className="rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-xl">{offering.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold gradient-text">{formatINR(offering.price)}</span>
                    {offering.deliveryTime && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {offering.deliveryTime}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2.5">
                    {offering.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 gradient-button" 
                      onClick={() => handleCheckout(offering)}
                    >
                      Select Plan
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => handleCheckout(offering)}
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

      {/* Monthly Maintenance Plans Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <ServiceNiche3dIcon
            variant="service"
            service={{ serviceType: 'maintenance-plans' }}
            size={56}
            className="rounded-xl gradient-icon-border"
          />
          <h2 className="text-3xl font-bold tracking-tight">Monthly Maintenance Plans</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {maintenancePlans.map((plan) => (
            <Card key={plan.id} className="gradient-card-border hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <ServiceNiche3dIcon
                    variant="service"
                    service={{ serviceType: 'maintenance-plans' }}
                    size={48}
                    className="rounded-lg"
                  />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold gradient-text">{formatINR(plan.price)}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 gradient-button" 
                    onClick={() => handleCheckout(plan)}
                  >
                    Select Plan
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => handleCheckout(plan)}
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {selectedOffering && (
        <CheckoutDialog
          open={checkoutDialogOpen}
          onOpenChange={setCheckoutDialogOpen}
          serviceId={selectedOffering.id}
          serviceName={selectedOffering.name}
          amount={selectedOffering.price}
        />
      )}
    </div>
  );
}
