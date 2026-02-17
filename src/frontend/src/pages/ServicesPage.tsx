import { useState, useEffect } from 'react';
import { useGetAllServices, useUpdateServiceStatus, useSeedServices } from '../hooks/useServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ServiceDialog } from '../components/services/ServiceDialog';
import { toast } from 'sonner';
import type { Service } from '../backend';
import { generateCatalogServices } from '../utils/services/seedCatalog';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';

const SEEDED_FLAG_KEY = 'services_catalog_seeded';

export default function ServicesPage() {
  const { data: services = [], isLoading } = useGetAllServices();
  const { data: profile } = useGetCallerUserProfile();
  const updateStatus = useUpdateServiceStatus();
  const seedServices = useSeedServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showSeedButton, setShowSeedButton] = useState(false);

  useEffect(() => {
    // Check if catalog has been seeded
    const hasSeeded = localStorage.getItem(SEEDED_FLAG_KEY);
    
    // Show seed button if not seeded and services list is empty or very small
    if (!hasSeeded && services.length < 10) {
      setShowSeedButton(true);
    } else {
      setShowSeedButton(false);
    }
  }, [services.length]);

  const handleToggleActive = async (service: Service) => {
    try {
      await updateStatus.mutateAsync({ serviceId: service.id, active: !service.active });
      toast.success(`Service ${!service.active ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update service status');
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleSeedCatalog = async () => {
    try {
      const agency = profile?.agency || 'Default Agency';
      const catalogServices = generateCatalogServices(agency);
      
      // Filter out services that already exist (by name)
      const existingNames = new Set(services.map(s => s.name));
      const newServices = catalogServices.filter(s => !existingNames.has(s.name));
      
      if (newServices.length === 0) {
        toast.info('All catalog services already exist');
        localStorage.setItem(SEEDED_FLAG_KEY, 'true');
        setShowSeedButton(false);
        return;
      }

      await seedServices.mutateAsync(newServices);
      
      localStorage.setItem(SEEDED_FLAG_KEY, 'true');
      setShowSeedButton(false);
      toast.success(`Successfully added ${newServices.length} services from catalog`);
    } catch (error: any) {
      console.error('Seed catalog error:', error);
      toast.error(error.message || 'Failed to seed catalog');
    }
  };

  const formatINR = (amount: bigint | number) => {
    const num = typeof amount === 'bigint' ? Number(amount) : amount;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <div className="flex gap-2">
          {showSeedButton && (
            <Button 
              onClick={handleSeedCatalog} 
              variant="outline"
              disabled={seedServices.isPending}
            >
              {seedServices.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Loading Catalog...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Load Service Catalog
                </>
              )}
            </Button>
          )}
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">No services yet.</p>
            {showSeedButton && (
              <Button onClick={handleSeedCatalog} disabled={seedServices.isPending}>
                {seedServices.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading Catalog...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Load Service Catalog
                  </>
                )}
              </Button>
            )}
            <p className="text-sm text-muted-foreground">Or add your first service manually</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Switch 
                    checked={service.active} 
                    onCheckedChange={() => handleToggleActive(service)}
                    disabled={updateStatus.isPending}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.serviceType && service.serviceType !== 'default' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline" className="text-xs">{service.serviceType}</Badge>
                  </div>
                )}
                {service.serviceSubType && service.serviceSubType !== 'default' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sub-Type</span>
                    <Badge variant="secondary">{service.serviceSubType}</Badge>
                  </div>
                )}
                {service.niche && service.niche !== 'default' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Niche</span>
                    <span className="text-sm font-medium">{service.niche}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold">{formatINR(service.price)}</span>
                </div>
                {service.cost && Number(service.cost) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cost</span>
                    <span className="text-sm">{formatINR(service.cost)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery</span>
                  <span className="text-sm">{service.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sales</span>
                  <Badge variant="secondary">{Number(service.salesCount)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-semibold text-green-600">
                    {formatINR(service.revenue)}
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => handleEdit(service)}>
                  Edit Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ServiceDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        service={selectedService}
      />
    </div>
  );
}
