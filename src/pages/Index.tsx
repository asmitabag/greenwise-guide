
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Categories } from "@/components/Categories";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  return data;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const filteredProducts = selectedCategory === "All Products"
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eco-background flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-eco-background flex items-center justify-center">
        <p className="text-lg text-red-600">Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eco-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-eco-primary text-white hover:bg-eco-primary/90 transition-colors"
          >
            <UserRound size={20} />
            <span>Profile</span>
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <span className="inline-block px-4 py-1 bg-eco-muted text-eco-primary rounded-full text-sm font-medium mb-4">
            Sustainable Shopping Made Simple
          </span>
          <h1 className="text-4xl font-bold text-eco-secondary mb-4">
            Discover Eco-Friendly Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and compare sustainable products that match your values. Every purchase makes a difference for our planet.
          </p>
        </div>

        <Categories
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              title={product.title}
              description={product.description || ''}
              image={product.image_url || ''}
              price={product.price}
              sustainabilityScore={product.sustainability_score}
              ecoFeatures={product.eco_features}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
