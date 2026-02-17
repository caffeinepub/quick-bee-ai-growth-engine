import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddService } from '../../hooks/useServices';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { toast } from 'sonner';
import type { Service } from '../../backend';
import { parseListField, joinListField } from '../../utils/services/serviceDetails';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
}

export function ServiceDialog({ open, onOpenChange, service }: ServiceDialogProps) {
  const { data: profile } = useGetCallerUserProfile();
  const addService = useAddService();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    deliveryTime: '',
    serviceType: '',
    serviceSubType: '',
    cost: '',
    niche: '',
    date: '',
    time: '',
    agency: '',
    shortDescription: '',
    detailedDescription: '',
    deliverables: '',
    requirements: '',
    supportedProviders: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        price: Number(service.price).toString(),
        deliveryTime: service.deliveryTime,
        serviceType: service.serviceType || '',
        serviceSubType: service.serviceSubType || '',
        cost: Number(service.cost).toString(),
        niche: service.niche || '',
        date: service.date || '',
        time: service.time || '',
        agency: service.agency || '',
        shortDescription: service.shortDescription || '',
        detailedDescription: service.detailedDescription || '',
        deliverables: joinListField(service.deliverables || []),
        requirements: joinListField(service.requirements || []),
        supportedProviders: joinListField(service.supportedProviders || []),
      });
    } else {
      setFormData({
        name: '',
        price: '',
        deliveryTime: '',
        serviceType: '',
        serviceSubType: '',
        cost: '',
        niche: '',
        date: '',
        time: '',
        agency: profile?.agency || '',
        shortDescription: '',
        detailedDescription: '',
        deliverables: '',
        requirements: '',
        supportedProviders: '',
      });
    }
  }, [service, open, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.deliveryTime) {
      toast.error('Please fill in all required fields (name, price, delivery time)');
      return;
    }

    try {
      // Use profile agency if available, otherwise allow user to specify or use default
      const agency = formData.agency || profile?.agency || 'Default Agency';

      const serviceData: Service = {
        id: service?.id || `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agency,
        name: formData.name,
        price: BigInt(formData.price),
        deliveryTime: formData.deliveryTime,
        active: service?.active ?? true,
        revenue: service?.revenue || BigInt(0),
        salesCount: service?.salesCount || BigInt(0),
        serviceType: formData.serviceType || 'default',
        serviceSubType: formData.serviceSubType || 'default',
        cost: formData.cost ? BigInt(formData.cost) : BigInt(0),
        niche: formData.niche || 'default',
        date: formData.date || '',
        time: formData.time || '',
        shortDescription: formData.shortDescription.trim(),
        detailedDescription: formData.detailedDescription.trim(),
        deliverables: parseListField(formData.deliverables),
        requirements: parseListField(formData.requirements),
        supportedProviders: parseListField(formData.supportedProviders),
      };

      await addService.mutateAsync(serviceData);
      
      toast.success(service ? 'Service updated successfully' : 'Service added successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Service save error:', error);
      toast.error(error.message || 'Failed to save service');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {service ? 'Update service details and specifications' : 'Enter the details of your new service offering'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <form onSubmit={handleSubmit} id="service-form">
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Basic Information</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., International Payment Gateway Setup"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (INR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., 50000"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Cost (INR)</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="e.g., 20000"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deliveryTime">Delivery Time *</Label>
                  <Input
                    id="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g., 5-7 days"
                  />
                </div>
              </div>

              <Separator />

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Service Details</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief overview of the service (1-2 sentences)"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">A concise summary that appears in service listings</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="detailedDescription">Detailed Description</Label>
                  <Textarea
                    id="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    placeholder="Comprehensive description of what this service includes, how it works, and its benefits"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">Full details shown when viewing service information</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deliverables">Deliverables</Label>
                  <Textarea
                    id="deliverables"
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                    placeholder="Enter each deliverable on a new line&#10;e.g.,&#10;Complete payment gateway integration&#10;Testing and documentation&#10;30 days support"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">List what clients will receive (one item per line)</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Enter each requirement on a new line&#10;e.g.,&#10;Active business registration&#10;Bank account details&#10;Website or app access"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">What clients need to provide (one item per line)</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supportedProviders">Supported Providers</Label>
                  <Textarea
                    id="supportedProviders"
                    value={formData.supportedProviders}
                    onChange={(e) => setFormData({ ...formData, supportedProviders: e.target.value })}
                    placeholder="Enter each provider on a new line&#10;e.g.,&#10;Stripe&#10;PayPal&#10;Razorpay"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Payment gateways or platforms supported (one per line)</p>
                </div>
              </div>

              <Separator />

              {/* Classification */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Classification</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Input
                      id="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      placeholder="e.g., Payment Solutions"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="serviceSubType">Service Sub-Type</Label>
                    <Input
                      id="serviceSubType"
                      value={formData.serviceSubType}
                      onChange={(e) => setFormData({ ...formData, serviceSubType: e.target.value })}
                      placeholder="e.g., Gateway Integration"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="niche">Niche</Label>
                  <Input
                    id="niche"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    placeholder="e.g., E-commerce"
                  />
                </div>

                {!profile?.agency && (
                  <div className="grid gap-2">
                    <Label htmlFor="agency">Agency</Label>
                    <Input
                      id="agency"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                      placeholder="Enter agency name"
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>
          
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="service-form" disabled={addService.isPending}>
            {addService.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              service ? 'Update Service' : 'Add Service'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
