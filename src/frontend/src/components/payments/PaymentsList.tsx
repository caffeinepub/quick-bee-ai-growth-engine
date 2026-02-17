import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetUserPayments, useUpdatePaymentStatus } from '../../hooks/usePayments';
import { useGetAllServices } from '../../hooks/useServices';
import { useIsCallerAdmin } from '../../hooks/useAuthRole';
import { PaymentStatus } from '../../backend';
import { CreditCard, Clock, CheckCircle, XCircle, Ban } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentsList() {
  const { data: payments = [], isLoading } = useGetUserPayments();
  const { data: services = [] } = useGetAllServices();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const updateStatus = useUpdatePaymentStatus();

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || serviceId;
  };

  const formatINR = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.pending:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case PaymentStatus.paid:
        return <Badge className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Paid</Badge>;
      case PaymentStatus.failed:
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>;
      case PaymentStatus.cancelled:
        return <Badge variant="outline"><Ban className="mr-1 h-3 w-3" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'upi':
        return 'UPI';
      case 'razorpay':
        return 'Razorpay';
      case 'stripe':
        return 'Stripe';
      default:
        return method;
    }
  };

  const handleStatusUpdate = async (paymentId: string, newStatus: PaymentStatus) => {
    try {
      await updateStatus.mutateAsync({ paymentId, status: newStatus });
      toast.success('Payment status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-2">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No payments yet</p>
          <p className="text-sm text-muted-foreground">Your payment orders will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{getServiceName(payment.serviceId)}</CardTitle>
                <p className="text-sm text-muted-foreground">Order ID: {payment.id}</p>
              </div>
              {getStatusBadge(payment.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">{formatINR(payment.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{getMethodLabel(payment.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-sm">{formatDate(payment.updatedAt)}</p>
              </div>
            </div>

            {isAdmin && payment.status === PaymentStatus.pending && (
              <div className="pt-3 border-t space-y-2">
                <p className="text-sm font-medium">Admin: Update Status</p>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) => handleStatusUpdate(payment.id, value as PaymentStatus)}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PaymentStatus.paid}>Mark as Paid</SelectItem>
                      <SelectItem value={PaymentStatus.failed}>Mark as Failed</SelectItem>
                      <SelectItem value={PaymentStatus.cancelled}>Mark as Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
