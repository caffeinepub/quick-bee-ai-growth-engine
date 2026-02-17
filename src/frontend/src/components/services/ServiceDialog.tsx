import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddService } from '../../hooks/useServices';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { toast } from 'sonner';
import type { Service } from '../../backend';

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {service ? 'Update service details' : 'Enter the details of your new service'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Social Media Management"
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
                placeholder="e.g., 7 days"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="e.g., Website & Funnel Services"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="serviceSubType">Service Sub-Type</Label>
                <Input
                  id="serviceSubType"
                  value={formData.serviceSubType}
                  onChange={(e) => setFormData({ ...formData, serviceSubType: e.target.value })}
                  placeholder="e.g., Development"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addService.isPending}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
