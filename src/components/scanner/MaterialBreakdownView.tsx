
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MaterialBreakdownView = () => {
  const [materialBreakdown, setMaterialBreakdown] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterialBreakdown();
  }, []);

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

  return (
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
};

export default MaterialBreakdownView;
