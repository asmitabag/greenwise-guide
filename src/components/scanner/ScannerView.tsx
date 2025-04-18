
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import MaterialScanner from "@/components/MaterialScanner";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ScannerViewProps {
  onScanComplete: (productId?: string) => void;
}

const ScannerView = ({ onScanComplete }: ScannerViewProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanAttempted, setScanAttempted] = useState(false);
  const [lastScannedProduct, setLastScannedProduct] = useState<string | null>(null);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  const { toast } = useToast();

  // Load initial state from session storage
  useEffect(() => {
    try {
      const storedProduct = sessionStorage.getItem('lastScannedProduct');
      const storedMaterials = sessionStorage.getItem('detectedMaterials');
      
      if (storedProduct) {
        setLastScannedProduct(storedProduct);
        setScanAttempted(true);
      }
      
      if (storedMaterials) {
        setDetectedMaterials(JSON.parse(storedMaterials));
      }
    } catch (error) {
      console.error("Error loading from session storage:", error);
    }
  }, []);

  // Handle materials detected from the scanner
  const handleMaterialsDetected = (materials: string[]) => {
    console.log("Materials detected:", materials);
    setDetectedMaterials(materials);
    
    // Save detected materials to session storage for use in analysis view
    try {
      sessionStorage.setItem('detectedMaterials', JSON.stringify(materials));
    } catch (e) {
      console.error("Error storing materials in session storage:", e);
    }
  };

  // Enhanced scan complete handler that sets product ID and navigates to analysis
  const handleScanComplete = (productId?: string, materials?: string[]) => {
    setScanAttempted(true);
    
    if (productId) {
      console.log("Scan complete with product ID:", productId);
      setLastScannedProduct(productId);
      
      if (materials && materials.length > 0) {
        setDetectedMaterials(materials);
        
        // Store the materials in session storage for the analysis view
        try {
          sessionStorage.setItem('detectedMaterials', JSON.stringify(materials));
        } catch (e) {
          console.error("Error storing materials in session storage:", e);
        }
      }
      
      // Store the scan information in session storage for the analysis view
      try {
        sessionStorage.setItem('lastScannedProduct', productId);
      } catch (e) {
        console.error("Error storing scan data:", e);
      }
    } 
    
    setShowScanner(false);
  };

  const handleStartScan = () => {
    setScanAttempted(false);
    setDetectedMaterials([]);
    setShowScanner(true);
  };

  const handleViewResults = () => {
    // Fix: Determine a fallback product ID if none is specified
    const effectiveProductId = lastScannedProduct || (detectedMaterials.some(m => m.toLowerCase().includes('alcohol') || m.toLowerCase().includes('fragrance')) ? "perfume" : 
                              detectedMaterials.some(m => m.toLowerCase().includes('bamboo')) ? "1" :
                              detectedMaterials.some(m => m.toLowerCase().includes('cotton')) ? "2" :
                              detectedMaterials.some(m => m.toLowerCase().includes('cream') || m.toLowerCase().includes('aloe')) ? "3" :
                              detectedMaterials.some(m => m.toLowerCase().includes('paper')) ? "4" :
                              detectedMaterials.some(m => m.toLowerCase().includes('solar') || m.toLowerCase().includes('lithium')) ? "5" : 
                              "perfume");
    
    // Important: Store in session storage before navigating
    try {
      sessionStorage.setItem('lastScannedProduct', effectiveProductId);
      
      if (detectedMaterials.length > 0) {
        sessionStorage.setItem('detectedMaterials', JSON.stringify(detectedMaterials));
      }
    } catch (e) {
      console.error("Error storing scan data before navigation:", e);
    }
    
    console.log("View Results clicked, navigating with product:", effectiveProductId, "materials:", detectedMaterials);
    
    // Force navigation to analysis tab by calling onScanComplete with the product ID
    onScanComplete(effectiveProductId);
    
    // Show toast for feedback
    toast({
      title: "Navigating to Analysis",
      description: "Showing analysis for detected materials",
    });
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
                onClick={handleStartScan}
                className="w-full bg-eco-primary text-white"
                size="lg"
              >
                Start New Scan
              </Button>
              
              {scanAttempted && (
                <div className="mt-6 space-y-4">
                  {detectedMaterials.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded border">
                      <h4 className="font-medium text-sm mb-2">Detected Materials:</h4>
                      <div className="flex flex-wrap gap-1">
                        {detectedMaterials.map((material, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Your last scan was completed. View the results in the Analysis tab.
                  </p>
                  <Button 
                    onClick={handleViewResults}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    View Results
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <MaterialScanner 
            productId={lastScannedProduct || "external-scan"} 
            onScanComplete={handleScanComplete}
            onMaterialsDetected={handleMaterialsDetected}
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
