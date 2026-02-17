import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCreatePayment, useGetPaymentSettings } from '../../hooks/usePayments';
import { PaymentMethod } from '../../backend';
import { toast } from 'sonner';
import { ExternalLink, CreditCard, Smartphone, Globe } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  serviceName: string;
  amount: number;
}

export function CheckoutDialog({ open, onOpenChange, serviceId, serviceName, amount }: CheckoutDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.upi);
  const [orderId, setOrderId] = useState<string | null>(null);
  const createPayment = useCreatePayment();
  const { data: paymentSettings } = useGetPaymentSettings();

  // Refs for auto-scrolling
  const paymentMethodSectionRef = useRef<HTMLDivElement>(null);
  const instructionsSectionRef = useRef<HTMLDivElement>(null);

  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Auto-scroll to payment method section when dialog opens
  useEffect(() => {
    if (open && paymentMethodSectionRef.current) {
      setTimeout(() => {
        paymentMethodSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [open]);

  // Auto-scroll to instructions when order is created or payment method changes
  useEffect(() => {
    if (orderId && instructionsSectionRef.current) {
      setTimeout(() => {
        instructionsSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [orderId, selectedMethod]);

  const handleCreateOrder = async () => {
    try {
      const paymentId = await createPayment.mutateAsync({
        serviceId,
        amount: BigInt(amount),
        paymentMethod: selectedMethod,
      });
      setOrderId(paymentId);
      toast.success('Order created successfully! Please complete the payment.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    }
  };

  const handleClose = () => {
    setOrderId(null);
    setSelectedMethod(PaymentMethod.upi);
    onOpenChange(false);
  };

  const getPaymentLink = () => {
    if (!paymentSettings) return '#';
    switch (selectedMethod) {
      case PaymentMethod.razorpay:
        return paymentSettings.razorpayLink;
      case PaymentMethod.stripe:
        return paymentSettings.stripeLink;
      default:
        return '#';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your purchase for {serviceName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{serviceName}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>{formatINR(amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div ref={paymentMethodSectionRef} className="space-y-4">
            <h3 className="font-semibold text-lg">Select Payment Method</h3>
            <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
              <div className="space-y-3">
                <Label
                  htmlFor="upi"
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={PaymentMethod.upi} id="upi" />
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">UPI Payment</div>
                    <div className="text-sm text-muted-foreground">Pay using any UPI app</div>
                  </div>
                </Label>

                <Label
                  htmlFor="razorpay"
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={PaymentMethod.razorpay} id="razorpay" />
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Razorpay</div>
                    <div className="text-sm text-muted-foreground">Cards, UPI, Net Banking (India)</div>
                  </div>
                </Label>

                <Label
                  htmlFor="stripe"
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={PaymentMethod.stripe} id="stripe" />
                  <Globe className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Stripe</div>
                    <div className="text-sm text-muted-foreground">International cards & payments</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Create Order Button */}
          {!orderId && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCreateOrder}
              disabled={createPayment.isPending}
            >
              {createPayment.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Order...
                </>
              ) : (
                'Create Order'
              )}
            </Button>
          )}

          {/* Payment Instructions (shown after order creation) */}
          {orderId && (
            <div ref={instructionsSectionRef} className="space-y-4 pt-4 border-t">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Order ID: {orderId}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Please save this order ID for your records
                </p>
              </div>

              <h3 className="font-semibold text-lg">Payment Instructions</h3>

              {selectedMethod === PaymentMethod.upi && paymentSettings && (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <p className="text-sm">Send payment to the following UPI ID:</p>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                      {paymentSettings.upiDetails}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      After completing the payment, your order will be processed within 24 hours.
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedMethod === PaymentMethod.razorpay && (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <p className="text-sm">Click the button below to complete your payment via Razorpay:</p>
                    <Button 
                      className="w-full" 
                      variant="default"
                      asChild
                    >
                      <a href={getPaymentLink()} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Pay with Razorpay
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      You'll be redirected to Razorpay's secure payment page.
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedMethod === PaymentMethod.stripe && (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <p className="text-sm">Click the button below to complete your payment via Stripe:</p>
                    <Button 
                      className="w-full" 
                      variant="default"
                      asChild
                    >
                      <a href={getPaymentLink()} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Pay with Stripe
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      You'll be redirected to Stripe's secure payment page.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Button variant="outline" className="w-full" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
