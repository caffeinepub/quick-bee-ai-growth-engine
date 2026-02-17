import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ServiceNiche3dIcon } from '../common/ServiceNiche3dIcon';
import type { Service } from '../../backend';
import { Package, Clock, DollarSign, CheckCircle, FileText, Wrench, ShoppingCart } from 'lucide-react';

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onCheckout?: () => void;
}

export function ServiceDetailsDialog({ open, onOpenChange, service, onCheckout }: ServiceDetailsDialogProps) {
  if (!service) return null;

  const formatINR = (amount: bigint | number) => {
    const num = typeof amount === 'bigint' ? Number(amount) : amount;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const hasDeliverables = service.deliverables && service.deliverables.length > 0;
  const hasRequirements = service.requirements && service.requirements.length > 0;
  const hasSupportedProviders = service.supportedProviders && service.supportedProviders.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-2">
            <ServiceNiche3dIcon
              variant="service"
              service={service}
              size={56}
              className="flex-shrink-0 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl">{service.name}</DialogTitle>
              {service.shortDescription && (
                <DialogDescription className="text-base mt-1">
                  {service.shortDescription}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold">{formatINR(service.price)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Time</p>
                  <p className="font-semibold">{service.deliveryTime}</p>
                </div>
              </div>
            </div>

            {/* Service Type & Status */}
            <div className="flex flex-wrap gap-2">
              {service.serviceType && service.serviceType !== 'default' && (
                <Badge variant="outline">{service.serviceType}</Badge>
              )}
              {service.serviceSubType && service.serviceSubType !== 'default' && (
                <Badge variant="secondary">{service.serviceSubType}</Badge>
              )}
              {service.niche && service.niche !== 'default' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md">
                  <ServiceNiche3dIcon
                    variant="niche"
                    niche={service.niche}
                    size={16}
                    className="rounded"
                  />
                  <span className="text-xs font-medium">{service.niche}</span>
                </div>
              )}
              {service.active ? (
                <Badge className="bg-green-600">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>

            {/* Detailed Description */}
            {service.detailedDescription && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  About This Service
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.detailedDescription}
                </p>
              </div>
            )}

            {/* Deliverables */}
            {hasDeliverables && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    What You'll Get
                  </h3>
                  <ul className="space-y-2">
                    {service.deliverables.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Requirements */}
            {hasRequirements && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {service.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Supported Providers */}
            {hasSupportedProviders && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Supported Providers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.supportedProviders.map((provider, index) => (
                      <Badge key={index} variant="outline">{provider}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onCheckout && (
            <Button onClick={onCheckout}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Checkout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
