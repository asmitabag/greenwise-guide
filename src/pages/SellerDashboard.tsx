
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Store, Package, CheckCircle } from "lucide-react";
import ProductForm from "@/components/seller/ProductForm";

const SellerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkSellerStatus();
    fetchProducts();
  }, []);

  const checkSellerStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: profile, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching seller profile:', error);
      return;
    }

    setSellerProfile(profile);
    setIsLoading(false);
  };

  const fetchProducts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_verification_requests (
          status,
          submitted_at
        )
      `)
      .eq('seller_id', session.user.id);

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
  };

  const handleProductSubmit = async (productData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add products",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            ...productData,
            seller_id: session.user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Create verification request
      await supabase
        .from('product_verification_requests')
        .insert([
          {
            product_id: data.id,
            seller_id: session.user.id,
            verification_data: productData.verification_data
          }
        ]);

      toast({
        title: "Product submitted",
        description: "Your product has been submitted for verification",
      });

      setShowProductForm(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!sellerProfile) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Become a Seller</h2>
          <p className="mb-4">Register your business to start selling eco-friendly products.</p>
          <Button onClick={() => navigate('/seller/register')}>Register as Seller</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{sellerProfile.business_name}</h1>
              <p className="text-gray-600">{sellerProfile.business_description}</p>
            </div>
            {sellerProfile.verified && (
              <Badge variant="secondary" className="bg-green-100">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified Seller
              </Badge>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Products</h2>
            <Button onClick={() => setShowProductForm(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {showProductForm ? (
            <ProductForm onSubmit={handleProductSubmit} onCancel={() => setShowProductForm(false)} />
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </div>
                  <Badge variant={product.product_verification_requests?.[0]?.status === 'approved' ? 'success' : 'warning'}>
                    {product.product_verification_requests?.[0]?.status || 'Pending Verification'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
