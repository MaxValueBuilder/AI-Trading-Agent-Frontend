import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2, XCircle } from "lucide-react";
import { subscriptionApiService } from "@/services/subscriptionApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get('payment_id');
  const trackingId = searchParams.get('tracking_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Wait for authentication to complete before making API calls
    if (authLoading) {
      return;
    }
     
    if (paymentId) {
      checkPaymentStatus();
    } else if (orderId) {
      // Always use public endpoint for order_id to avoid double calls
      checkPaymentByOrderIdPublic();
    } else {
      setError("No payment information provided");
      setLoading(false);
    }
  }, [paymentId, orderId, authLoading]);

  const checkPaymentStatus = async () => {
    try {
      if (!paymentId) return;
      
      const payment = await subscriptionApiService.getPaymentStatus(parseInt(paymentId));
      setPaymentStatus(payment);
      
      if (payment.status === 'completed') {
        toast.success("Payment completed successfully!");
      } else if (payment.status === 'failed') {
        setError("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setError("Failed to verify payment status");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentByOrderIdPublic = async () => {
    try {
      if (!orderId) return;
      
      // Always use public endpoint to avoid double calls
      const payment = await subscriptionApiService.getPaymentByOrderIdPublic(orderId);
      
      setPaymentStatus(payment);
      
      if (payment.status === 'completed') {
        toast.success("Payment completed successfully!");
      } else if (payment.status === 'failed') {
        setError("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error checking payment by order ID:", error);
      setError("Failed to verify payment status");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const handleRetryPayment = () => {
    navigate("/subscription");
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-crypto-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-green mx-auto mb-4" />
          <p className="text-crypto-text-secondary">
            {authLoading ? "Authenticating..." : "Verifying payment..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-bg flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="bg-crypto-card border-crypto-border">
          <CardHeader className="text-center">
            {error ? (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-crypto-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-crypto-green" />
              </div>
            )}
            
            <CardTitle className="text-2xl font-bold text-crypto-text-primary">
              {error ? "Payment Failed" : "Payment Successful!"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error ? (
              <div className="text-center space-y-4">
                <p className="text-crypto-text-secondary">
                  {error}
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleRetryPayment}
                    className="w-full bg-crypto-green hover:bg-crypto-green/90 text-white"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleContinue}
                    variant="outline"
                    className="w-full border-crypto-border hover:bg-crypto-card"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : paymentStatus ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-crypto-text-secondary mb-4">
                    Your subscription has been activated successfully!
                  </p>
                  
                  <div className="bg-crypto-bg/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-crypto-text-secondary">Plan:</span>
                      <span className="text-crypto-text-primary font-semibold capitalize">
                        {paymentStatus.plan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crypto-text-secondary">Amount:</span>
                      <span className="text-crypto-text-primary font-semibold">
                        ${paymentStatus.amount} {paymentStatus.currency}
                      </span>
                    </div>
                    {paymentStatus.oxapay_tx_hash && (
                      <div className="flex justify-between">
                        <span className="text-crypto-text-secondary">Transaction:</span>
                        <span className="text-crypto-text-primary font-mono text-xs">
                          {paymentStatus.oxapay_tx_hash.slice(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-crypto-green hover:bg-crypto-green/90 text-white"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-crypto-text-secondary">
                  Unable to verify payment status. Please contact support if you have any issues.
                </p>
                <Button 
                  onClick={handleContinue}
                  className="w-full mt-4 bg-crypto-green hover:bg-crypto-green/90 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
