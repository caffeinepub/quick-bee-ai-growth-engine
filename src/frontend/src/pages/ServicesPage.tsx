import { useState, useEffect } from 'react';
import { useGetAllServices, useUpdateServiceStatus, useSeedServices } from '../hooks/useServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, Eye, Edit, ShoppingCart, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ServiceDialog } from '../components/services/ServiceDialog';
import { ServiceDetailsDialog } from '../components/services/ServiceDetailsDialog';
import { CheckoutDialog } from '../components/payments/CheckoutDialog';
import { ServiceNiche3dIcon } from '../components/common/ServiceNiche3dIcon';
import { toast } from 'sonner';
import type { Service } from '../backend';
import { generateCatalogServices } from '../utils/services/seedCatalog';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const SEEDED_FLAG_KEY = 'services_catalog_seeded';

export default function ServicesPage() {
  const { data: services = [], isLoading } = useGetAllServices();
  const { data: profile } = useGetCallerUserProfile();
  const updateStatus = useUpdateServiceStatus();
  const seedServices = useSeedServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

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

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setDetailsDialogOpen(true);
  };

  const handleCheckout = (service: Service) => {
    setSelectedService(service);
    setCheckoutDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleSeedCatalog = async () => {
    try {
      const agency = profile?.agency || 'Default Agency';
      const catalogServices = generateCatalogServices(agency);
      
      const existingNames = new Set(services.map(s => s.name));
      const newServices = catalogServices.filter(s => !existingNames.has(s.name));
      
      if (newServices.length === 0) {
        toast.info('All catalog services already exist');
        localStorage.setItem(SEEDED_FLAG_KEY, 'true');
        return;
      }

      const results = await seedServices.mutateAsync(newServices);
      const successCount = results.filter((r: any) => r.success).length;
      
      localStorage.setItem(SEEDED_FLAG_KEY, 'true');
      toast.success(`Successfully added ${successCount} services from catalog`);
    } catch (error: any) {
      console.error('Seed catalog error:', error);
      toast.error(error.message || 'Failed to seed catalog');
    }
  };

  const formatINR = (amount: bigint | number) => {
    const num = typeof amount === 'bigint' ? Number(amount) : amount;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const filteredServices = services.filter(service => {
    if (!debouncedSearch) return true;
    const query = debouncedSearch.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.serviceType.toLowerCase().includes(query) ||
      service.niche.toLowerCase().includes(query)
    );
  });

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
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {services.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services by name, type, or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">No services yet.</p>
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
            <p className="text-sm text-muted-foreground">Or add your first service manually</p>
          </CardContent>
        </Card>
      ) : filteredServices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No services match your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map(service => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <ServiceNiche3dIcon
                      variant="service"
                      service={service}
                      size={40}
                      className="flex-shrink-0 rounded-lg"
                    />
                    <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
                  </div>
                  <Switch 
                    checked={service.active} 
                    onCheckedChange={() => handleToggleActive(service)}
                    disabled={updateStatus.isPending}
                    className="flex-shrink-0"
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">Niche</span>
                    <div className="flex items-center gap-1.5">
                      <ServiceNiche3dIcon
                        variant="niche"
                        niche={service.niche}
                        size={20}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{service.niche}</span>
                    </div>
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
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1" 
                    onClick={() => handleViewDetails(service)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1" 
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout(service)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Checkout
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

      <ServiceDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        service={selectedService}
        onCheckout={() => {
          setDetailsDialogOpen(false);
          if (selectedService) {
            handleCheckout(selectedService);
          }
        }}
      />

      {selectedService && (
        <CheckoutDialog
          open={checkoutDialogOpen}
          onOpenChange={setCheckoutDialogOpen}
          serviceId={selectedService.id}
          serviceName={selectedService.name}
          amount={Number(selectedService.price)}
        />
      )}
    </div>
  );
}
