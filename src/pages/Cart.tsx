
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    description: string;
  };
}

async function fetchCartItems() {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product:products (
        id,
        title,
        price,
        image_url,
        description
      )
    `)
    .eq('user_id', session.session.user.id);

  if (error) throw error;
  return data as CartItem[];
}

const Cart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cartItems', 'detailed'],
    queryFn: fetchCartItems
  });

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      if (newQuantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;

        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        });
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', itemId);

        if (error) throw error;

        toast({
          title: "Cart updated",
          description: "Item quantity has been updated",
        });
      }

      // Refresh cart data
      await queryClient.invalidateQuery({ queryKey: ['cartItems'] });
      await queryClient.invalidateQuery({ queryKey: ['cartItems', 'detailed'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });

      // Refresh cart data
      await queryClient.invalidateQuery({ queryKey: ['cartItems'] });
      await queryClient.invalidateQuery({ queryKey: ['cartItems', 'detailed'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eco-background flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eco-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-eco-primary hover:text-eco-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-eco-secondary mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/">
              <Button className="bg-eco-primary text-white hover:bg-eco-accent">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32">
                    <img
                      src={item.product.image_url || ''}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-eco-secondary mb-2">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdating}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-lg font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-eco-secondary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold text-eco-secondary">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-eco-primary text-white hover:bg-eco-accent px-8"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
