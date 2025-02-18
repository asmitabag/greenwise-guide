
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [sellerRequests, setSellerRequests] = useState<any[]>([]);
  const [productRequests, setProductRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Fetch seller verification requests
      const { data: sellers, error: sellerError } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('verified', false);

      if (sellerError) throw sellerError;

      // Fetch product verification requests
      const { data: products, error: productError } = await supabase
        .from('product_verification_requests')
        .select(`
          *,
          products (
            title,
            brand,
            price
          ),
          seller_profiles (
            business_name
          )
        `)
        .eq('status', 'pending');

      if (productError) throw productError;

      setSellerRequests(sellers || []);
      setProductRequests(products || []);
    } catch (error: any) {
      toast({
        title: "Error fetching requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (type: 'seller' | 'product', id: string, approved: boolean) => {
    try {
      if (type === 'seller') {
        const { error } = await supabase
          .from('seller_profiles')
          .update({ verified: approved })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_verification_requests')
          .update({
            status: approved ? 'approved' : 'rejected',
            reviewed_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
      }

      toast({
        title: `${type} ${approved ? 'approved' : 'rejected'}`,
        description: `The ${type} has been ${approved ? 'approved' : 'rejected'} successfully.`,
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="sellers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sellers">Seller Verification</TabsTrigger>
          <TabsTrigger value="products">Product Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="sellers">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Pending Seller Verifications</h2>
            <div className="grid gap-4">
              {sellerRequests.map((seller) => (
                <div key={seller.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{seller.business_name}</h3>
                    <p className="text-sm text-gray-600">{seller.contact_email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerification('seller', seller.id, true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleVerification('seller', seller.id, false)}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {sellerRequests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending seller verifications</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Pending Product Verifications</h2>
            <div className="grid gap-4">
              {productRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{request.products.title}</h3>
                    <p className="text-sm text-gray-600">
                      {request.products.brand} - ${request.products.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seller: {request.seller_profiles.business_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerification('product', request.id, true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleVerification('product', request.id, false)}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {productRequests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending product verifications</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
