
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import MaterialScanner from "@/components/MaterialScanner";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, ArrowRight, Camera, History, PieChart as PieChartIcon } from "lucide-react";
import MaterialAnalysis from "@/components/MaterialAnalysis";

const Scanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [impactData, setImpactData] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [materialBreakdown, setMaterialBreakdown] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("scanner");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "impact") {
      fetchImpactData();
    } else if (activeTab === "history") {
      fetchRecentScans();
    } else if (activeTab === "breakdown") {
      fetchMaterialBreakdown();
    }
  }, [activeTab]);

  const fetchImpactData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your impact data",
        variant: "destructive",
      });
      return;
    }

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (
          sustainability_score,
          title
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch impact data",
        variant: "destructive",
      });
      return;
    }

    // Transform purchase data into chart data
    const chartData = purchases.map(purchase => ({
      date: new Date(purchase.created_at).toLocaleDateString(),
      impact: purchase.products?.sustainability_score || 0,
      product: purchase.products?.title
    }));

    setImpactData(chartData);
  };

  const fetchRecentScans = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your scan history",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('material_scans')
      .select(`
        *,
        products:product_id (
          id,
          title,
          brand,
          image_url,
          sustainability_score
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch scan history",
        variant: "destructive",
      });
      return;
    }

    setRecentScans(data || []);
  };

  const fetchMaterialBreakdown = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view material breakdown",
        variant: "destructive",
      });
      return;
    }

    // First get all the user's purchases
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('product_id')
      .eq('user_id', session.user.id);

    if (purchasesError) {
      toast({
        title: "Error",
        description: "Failed to fetch purchases",
        variant: "destructive",
      });
      return;
    }

    if (!purchases || purchases.length === 0) {
      return;
    }

    // Get material analysis for purchased products
    const productIds = purchases.map(p => p.product_id);
    const { data: materials, error: materialsError } = await supabase
      .from('material_analysis')
      .select('*')
      .in('product_id', productIds);

    if (materialsError) {
      toast({
        title: "Error",
        description: "Failed to fetch material data",
        variant: "destructive",
      });
      return;
    }

    // Calculate material breakdown
    const materialCounts: Record<string, number> = {};
    if (materials) {
      materials.forEach(material => {
        materialCounts[material.material_name] = (materialCounts[material.material_name] || 0) + 1;
      });
    }

    const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336', '#607D8B', '#00BCD4', '#FF5722'];
    
    const breakdownData = Object.entries(materialCounts)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

    setMaterialBreakdown(breakdownData);
  };

  const handleScanComplete = (productId?: string) => {
    setShowScanner(false);
    fetchRecentScans();
    if (productId) {
      setSelectedProduct(productId);
      setActiveTab("analysis");
    }
  };

  const renderImpactChart = () => (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Your Environmental Impact</CardTitle>
        <CardDescription>Track your sustainability journey over time</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded shadow-md">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm">Product: {payload[0].payload.product}</p>
                        <p className="text-green-600">
                          Eco Score: {payload[0].value}/10
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="impact" 
                stroke="#4CAF50" 
                name="Sustainability Score" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderMaterialBreakdown = () => (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Your Material Footprint</CardTitle>
        <CardDescription>Breakdown of materials in your purchased products</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {materialBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={materialBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {materialBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-medium mb-2">Material Composition</h3>
              <div className="space-y-2">
                {materialBreakdown.map((material, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: material.color }}
                    />
                    <span className="flex-1">{material.name}</span>
                    <span className="font-medium">{material.value} items</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Environmental Impact:</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Natural materials typically have a lower carbon footprint</li>
                  <li>Synthetic materials often use more water in production</li>
                  <li>Recyclable materials help reduce waste</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <PieChartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No material data available</h3>
            <p className="mt-1 text-sm text-gray-500">Scan products or make purchases to see your material footprint.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderScanHistory = () => (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Recent Scans</CardTitle>
        <CardDescription>Your recently scanned products and materials</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {recentScans.length > 0 ? (
          <div className="space-y-4">
            {recentScans.map((scan, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  if (scan.product_id) {
                    setSelectedProduct(scan.product_id);
                    setActiveTab("analysis");
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  {scan.products?.image_url && (
                    <img 
                      src={scan.products.image_url} 
                      alt={scan.products.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {scan.products?.title || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {scan.products?.brand || "Unknown Brand"}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-2">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                      {scan.products?.sustainability_score && (
                        <Badge variant="outline" className="text-xs">
                          <Leaf className="h-3 w-3 mr-1 text-green-500" />
                          Score: {scan.products.sustainability_score}/10
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No scan history</h3>
            <p className="mt-1 text-sm text-gray-500">Start scanning products to build your history.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 px-0 pb-0">
        <Button 
          onClick={() => setActiveTab("scanner")}
          className="w-full bg-eco-primary text-white"
        >
          <Camera className="mr-2 h-4 w-4" />
          Scan New Product
        </Button>
      </CardFooter>
    </Card>
  );

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
          </TabsContent>

          <TabsContent value="history">
            {renderScanHistory()}
          </TabsContent>

          <TabsContent value="impact">
            {renderImpactChart()}
          </TabsContent>

          <TabsContent value="breakdown">
            {renderMaterialBreakdown()}
          </TabsContent>

          <TabsContent value="analysis">
            {selectedProduct && (
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl">Material Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of materials and their environmental impact</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <MaterialAnalysis productId={selectedProduct} />
                </CardContent>
                <CardFooter className="pt-4 px-0 pb-0">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("history")}
                  >
                    Back to History
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Scanner;
