
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Droplets, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MaterialAnalysis from "@/components/MaterialAnalysis";
import { useState } from "react";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  price: number;
  sustainabilityScore: number;
  ecoFeatures: string[];
  id?: string;
}

export const ProductCard = ({
  title,
  description,
  image,
  price,
  sustainabilityScore,
  ecoFeatures,
  id,
}: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Unable to add item to cart",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to your cart",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .upsert({
          product_id: id,
          user_id: session.user.id,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart`,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in bg-white">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-eco-primary text-white">
            Score: {sustainabilityScore}/10
          </Badge>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-eco-secondary">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex gap-2">
          {ecoFeatures.includes("organic") && (
            <Badge variant="outline" className="bg-eco-muted">
              <Leaf className="w-4 h-4 mr-1" />
              Organic
            </Badge>
          )}
          {ecoFeatures.includes("recyclable") && (
            <Badge variant="outline" className="bg-eco-muted">
              <Recycle className="w-4 h-4 mr-1" />
              Recyclable
            </Badge>
          )}
          {ecoFeatures.includes("water-saving") && (
            <Badge variant="outline" className="bg-eco-muted">
              <Droplets className="w-4 h-4 mr-1" />
              Water-Saving
            </Badge>
          )}
        </div>
        
        {id && <MaterialAnalysis productId={id} />}

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-eco-secondary">
            ${price.toFixed(2)}
          </span>
          <Button 
            onClick={handleAddToCart}
            className="bg-eco-primary text-white hover:bg-eco-accent"
            disabled={isAddingToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
