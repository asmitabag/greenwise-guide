
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import MaterialScanner from "@/components/MaterialScanner";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScannerViewProps {
  onScanComplete: (productId?: string) => void;
}

const ScannerView = ({ onScanComplete }: ScannerViewProps) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (productId?: string) => {
    if (productId) {
      onScanComplete(productId);
    } else {
      setShowScanner(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Product Material Scanner</CardTitle>
        <CardDescription>
          Scan any product to analyze its materials and get a sustainability score
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {!showScanner ? (
          <div className="flex flex-col items-center py-12 space-y-4">
            <div className="bg-eco-muted rounded-full p-6">
              <Camera className="h-12 w-12 text-eco-primary" />
            </div>
            <div className="text-center max-w-sm">
              <h3 className="font-medium text-lg mb-2">How it works</h3>
              <p className="text-gray-600 mb-6">
                Our scanner analyzes product materials using computer vision 
                and provides detailed sustainability metrics.
              </p>
              <Button 
                onClick={() => setShowScanner(true)}
                className="w-full bg-eco-primary text-white"
                size="lg"
              >
                Start New Scan
              </Button>
            </div>
          </div>
        ) : (
          <MaterialScanner 
            productId="external-scan" 
            onScanComplete={handleScanComplete}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4 px-0 pb-0">
        {showScanner && (
          <Button 
            variant="outline" 
            onClick={() => setShowScanner(false)}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScannerView;
