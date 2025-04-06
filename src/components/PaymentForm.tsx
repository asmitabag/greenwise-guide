
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { CreditCard, IndianRupee, Shield } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ amount, orderId, onSuccess, onCancel }: PaymentFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setProcessingStage(25);

      setTimeout(() => setProcessingStage(50), 1000);

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethod,
          amount,
          orderId
        },
      });

      setTimeout(() => setProcessingStage(75), 2000);

      if (error) throw new Error(error.message);

      setProcessingStage(100);
      
      toast({
        title: "Payment Successful",
        description: `Transaction ID: ${data.transactionId}`,
      });

      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an issue processing your payment",
        variant: "destructive",
      });
      setIsProcessing(false);
      setProcessingStage(0);
    }
  };

  return (
    <Card className="p-6 w-full max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-eco-secondary">Complete Your Payment</h2>
        <p className="text-gray-600">Secure payment powered by EcoMarket Pay</p>
      </div>

      {isProcessing ? (
        <div className="space-y-6 py-4">
          <p className="text-center text-eco-secondary font-medium">
            Processing your payment...
          </p>
          <Progress 
            value={processingStage} 
            className="h-2 w-full"
            indicatorClassName="bg-eco-primary"
          />
          <div className="flex justify-center">
            <Shield className="text-eco-primary h-12 w-12 animate-pulse" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Please do not close this window while your payment is being processed.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Order Total:</span>
              <span className="text-xl font-bold text-eco-secondary flex items-center">
                <IndianRupee className="w-4 h-4 mr-1" />
                {formatINR(amount)}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <Label>Select Payment Method</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="upi" className="text-base">UPI</Label>
                  <p className="text-sm text-muted-foreground">
                    Pay using Google Pay, PhonePe, Paytm or any UPI app
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="card" id="card" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="card" className="text-base">Credit/Debit Card</Label>
                  <p className="text-sm text-muted-foreground">
                    Pay securely with your credit or debit card
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="netbanking" className="text-base">Net Banking</Label>
                  <p className="text-sm text-muted-foreground">
                    Pay directly from your bank account
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    className="pl-10"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" type="password" />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input id="upiId" placeholder="yourname@upi" />
              </div>
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <div className="space-y-4 mb-6">
              <div>
                <Label>Select Your Bank</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak"].map(bank => (
                    <Button 
                      key={bank}
                      variant="outline" 
                      className="justify-start"
                      type="button"
                    >
                      {bank} Bank
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-eco-primary text-white hover:bg-eco-accent"
              onClick={handlePayment}
            >
              Pay {formatINR(amount)}
            </Button>
          </div>
        </>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500 flex items-center justify-center">
          <Shield className="w-4 h-4 mr-1" />
          Secure transaction. Your payment information is protected.
        </p>
      </div>
    </Card>
  );
};

export default PaymentForm;
