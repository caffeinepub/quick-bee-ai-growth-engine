import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useGetClientServiceRequestsByAgency } from '../../hooks/useClientServiceRequests';
import { useGetAllServices } from '../../hooks/useServices';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function ClientServiceRequestsAdminPanel() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: requests = [], isLoading: requestsLoading } = useGetClientServiceRequestsByAgency(profile?.agency || '');
  const { data: services = [] } = useGetAllServices();

  if (requestsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Service Requests</CardTitle>
        <CardDescription>Review all client service requests for your agency</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No client service requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const service = services.find((s) => s.id === request.serviceId);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                            {request.principal}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{service?.name || 'Unknown Service'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          {request.details ? (
                            <p className="text-sm text-muted-foreground truncate">{request.details}</p>
                          ) : (
                            <span className="text-sm text-muted-foreground">No details</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Pending</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
