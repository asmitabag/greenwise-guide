
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ImpactChartView = () => {
  const [impactData, setImpactData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchImpactData();
  }, []);

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

  return (
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
};

export default ImpactChartView;
