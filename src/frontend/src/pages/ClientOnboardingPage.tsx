import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useGetAllServices } from '../hooks/useServices';
import { useCreateClientServiceRequest, useGetClientServiceRequestsByAgency } from '../hooks/useClientServiceRequests';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import type { Service, ClientServiceRequest } from '../backend';

export default function ClientOnboardingPage() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: services = [], isLoading: servicesLoading } = useGetAllServices();
  const { data: allRequests = [] } = useGetClientServiceRequestsByAgency(profile?.agency || '');
  const createRequest = useCreateClientServiceRequest();

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const currentPrincipal = identity?.getPrincipal().toString();
  const myRequests = allRequests.filter((req) => req.principal === currentPrincipal);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleSubmitRequest = async () => {
    if (!selectedService || !profile) return;

    await createRequest.mutateAsync({
      serviceId: selectedService.id,
      agency: profile.agency,
      details: `Service: ${selectedService.name}, Price: $${selectedService.price}, Delivery: ${selectedService.deliveryTime}`,
    });

    setSelectedService(null);
  };

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Onboarding</h1>
        <p className="text-muted-foreground">Select a service to get started with {profile?.agency}</p>
      </div>

      {selectedService ? (
        <Card>
          <CardHeader>
            <CardTitle>Review Service Details</CardTitle>
            <CardDescription>Please review the service details before submitting your request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedService.name}</h3>
                <Badge variant={selectedService.active ? 'default' : 'secondary'} className="mt-2">
                  {selectedService.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-2xl font-bold">${Number(selectedService.price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Delivery Time</p>
                    <p className="text-lg font-semibold">{selectedService.deliveryTime}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Service Performance</p>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Sales:</span>{' '}
                    <span className="font-medium">{Number(selectedService.salesCount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Revenue:</span>{' '}
                    <span className="font-medium">${Number(selectedService.revenue).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setSelectedService(null)} variant="outline" className="flex-1">
                Back to Services
              </Button>
              <Button
                onClick={handleSubmitRequest}
                disabled={createRequest.isPending}
                className="flex-1"
              >
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectService(service)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant={service.active ? 'default' : 'secondary'}>
                      {service.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${Number(service.price).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.deliveryTime}</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No services available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {myRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Requests</h2>
          <div className="grid gap-4">
            {myRequests.map((request) => {
              const service = services.find((s) => s.id === request.serviceId);
              return (
                <Card key={request.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold">{service?.name || 'Service'}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}
                        </p>
                        {request.details && (
                          <p className="text-sm text-muted-foreground mt-2">{request.details}</p>
                        )}
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
