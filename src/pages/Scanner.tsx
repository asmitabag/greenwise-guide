
import { useState } from "react";
import { Card } from "@/components/ui/card";
import MaterialScanner from "@/components/MaterialScanner";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

const Scanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [impactData, setImpactData] = useState<any[]>([]);
  const { toast } = useToast();

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

  const handleScanComplete = () => {
    setShowScanner(false);
    // Refresh impact data after scan
    fetchImpactData();
  };

  return (
    <div className="min-h-screen bg-eco-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Product Material Scanner</h1>
          <p className="text-gray-600 mb-4">
            Scan any product to analyze its materials and get a sustainability score.
          </p>
          {!showScanner ? (
            <Button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-eco-primary text-white"
            >
              Start New Scan
            </Button>
          ) : (
            <MaterialScanner 
              productId="external-scan" 
              onScanComplete={handleScanComplete}
            />
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Environmental Impact</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="impact" 
                  stroke="#4CAF50" 
                  name="Sustainability Score" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Scanner;
