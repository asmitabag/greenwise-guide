
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

  const handleScanComplete = (productId?: string) => {
    if (productId) {
      setSelectedProduct(productId);
      setActiveTab("analysis");
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    setActiveTab("analysis");
  };

  return (
    <div className="min-h-screen bg-eco-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="breakdown">Materials</TabsTrigger>
            {selectedProduct && (
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            )}
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
                onBack={() => setActiveTab("history")} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Scanner;
