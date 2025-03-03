
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, ArrowRight, Camera, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScanHistoryViewProps {
  onSelectProduct: (productId: string) => void;
  onStartNewScan: () => void;
}

const ScanHistoryView = ({ onSelectProduct, onStartNewScan }: ScanHistoryViewProps) => {
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentScans();
  }, []);

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

  return (
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
                    onSelectProduct(scan.product_id);
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
          onClick={onStartNewScan}
          className="w-full bg-eco-primary text-white"
        >
          <Camera className="mr-2 h-4 w-4" />
          Scan New Product
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScanHistoryView;
