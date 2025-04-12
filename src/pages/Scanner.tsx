
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScannerView from "@/components/scanner/ScannerView";
import ScanHistoryView from "@/components/scanner/ScanHistoryView";
import ImpactChartView from "@/components/scanner/ImpactChartView";
import MaterialBreakdownView from "@/components/scanner/MaterialBreakdownView";
import ProductAnalysisView from "@/components/scanner/ProductAnalysisView";

const Scanner = () => {
  const [activeTab, setActiveTab] = useState("scanner");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [autoNavigateEnabled, setAutoNavigateEnabled] = useState(true); // Changed to true by default

  const handleScanComplete = (productId?: string) => {
    if (productId) {
      setSelectedProduct(productId);
      if (autoNavigateEnabled) {
        setActiveTab("analysis");
      }
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    setActiveTab("analysis");
  };

  const handleBackToHistory = () => {
    if (autoNavigateEnabled) {
      setActiveTab("history");
    }
    // When auto-navigation is disabled, user controls navigation manually
  };

  return (
    <div className="min-h-screen bg-eco-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="breakdown">Materials</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!selectedProduct}>
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <ScannerView onScanComplete={handleScanComplete} />
          </TabsContent>

          <TabsContent value="history">
            <ScanHistoryView 
              onSelectProduct={handleSelectProduct} 
              onStartNewScan={() => setActiveTab("scanner")} 
            />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactChartView />
          </TabsContent>

          <TabsContent value="breakdown">
            <MaterialBreakdownView />
          </TabsContent>

          <TabsContent value="analysis">
            {selectedProduct && (
              <ProductAnalysisView 
                productId={selectedProduct} 
                onBack={handleBackToHistory} 
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
