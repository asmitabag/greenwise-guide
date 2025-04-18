
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScannerView from "@/components/scanner/ScannerView";
import ProductAnalysisView from "@/components/scanner/ProductAnalysisView";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Scanner = () => {
  const [activeTab, setActiveTab] = useState("scanner");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [autoNavigateEnabled, setAutoNavigateEnabled] = useState(true); // Default to true
  const { toast } = useToast();

  // Effect to restore state from session storage when component mounts
  useEffect(() => {
    try {
      const storedProduct = sessionStorage.getItem('lastScannedProduct');
      if (storedProduct) {
        setSelectedProduct(storedProduct);
        console.log("Restored product ID from session storage:", storedProduct);
      }
    } catch (e) {
      console.error("Error retrieving product from session storage:", e);
    }
  }, []);

  // Enhanced scan complete handler that sets product ID and navigates to analysis
  const handleScanComplete = (productId?: string) => {
    if (productId) {
      console.log("Scan complete with product ID:", productId);
      setSelectedProduct(productId);
      
      // Always store the current product ID in session storage
      try {
        sessionStorage.setItem('lastScannedProduct', productId);
      } catch (e) {
        console.error("Error storing product in session storage:", e);
      }
      
      // Force navigation to analysis tab
      setActiveTab("analysis");
      
      toast({
        title: "Scan Complete",
        description: "Navigating to analysis results",
      });
    }
  };

  // Handle back navigation from analysis with auto-navigation awareness
  const handleBackToScanner = () => {
    if (autoNavigateEnabled) {
      setActiveTab("scanner");
    }
    // When auto-navigation is disabled, user controls navigation manually
  };

  // When switching tabs, refresh the content to ensure proper data is displayed
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to analysis, make sure we have the latest product ID
    if (value === "analysis" && selectedProduct) {
      // Re-set the product ID to force the component to refresh
      const currentProductId = selectedProduct;
      setSelectedProduct(null);
      
      // Small delay to ensure the component unmounts before remounting
      setTimeout(() => {
        setSelectedProduct(currentProductId);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-eco-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-eco-primary">Material Scanner</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={18} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!selectedProduct}>
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <ScannerView onScanComplete={handleScanComplete} />
          </TabsContent>

          <TabsContent value="analysis">
            {selectedProduct && (
              <ProductAnalysisView 
                key={selectedProduct} /* Add key to force re-rendering when product changes */
                productId={selectedProduct} 
                onBack={handleBackToScanner} 
              />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoNavigateEnabled}
              onChange={() => setAutoNavigateEnabled(!autoNavigateEnabled)}
              className="mr-2 h-4 w-4"
            />
            Enable automatic navigation between pages
          </label>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
