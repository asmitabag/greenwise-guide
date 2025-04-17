
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Categories } from "@/components/Categories";
import { UserRound, ShoppingCart, Camera, Search, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

async function fetchProducts(searchTerm = '') {
  let query = supabase
    .from('products')
    .select('*');
  
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  if (data) {
    // Check for existing products and adjust their prices based on eco score
    data.forEach(product => {
      // Higher prices for sustainable products (eco score > 6)
      if (product.sustainability_score > 6) {
        // Premium pricing for sustainable products
        if (product.title.includes("Bamboo Water Bottle") || product.title.includes("EcoCharge Solar Power Bank")) {
          product.price = 3999;
        } else if (product.title.includes("Organic Cotton")) {
          product.price = 2499;
        } else if (product.title.includes("Natural Face Cream")) {
          product.price = 2999;
        } else if (product.title.includes("Recycled Coffee Cup")) {
          product.price = 1499;
        } else {
          // Default higher price for other sustainable products
          product.price = 2999;
        }
      } else {
        // Lower prices for less sustainable products (eco score <= 6)
        if (product.title.includes("FastGlam Party Dress")) {
          product.price = 999;
        } else if (product.title.includes("SnapQuick Disposable Camera")) {
          product.price = 599;
        } else if (product.title.includes("TrendEye Colorful Sunglasses")) {
          product.price = 399;
        } else {
          // Default lower price for other less sustainable products
          product.price = 799;
        }
      }
    });
    
    const hasSolarPowerBank = data.some(product => product.title.includes("Solar Power Bank"));
    
    if (!hasSolarPowerBank) {
      data.push({
        id: "solar-power-bank-001",
        title: "EcoCharge Solar Power Bank",
        description: "Portable 20000mAh solar power bank with fast charging capabilities. Perfect for outdoor activities and emergencies.",
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        price: 3999, // Higher price for eco-friendly product
        sustainability_score: 9,
        eco_features: ["recyclable", "energy-efficient", "solar-powered"],
        brand: "EcoCharge",
        category: "Electronics",
        carbon_footprint: 5.2,
        created_at: new Date().toISOString(),
        materials: ["recycled aluminum", "silicon solar panels", "lithium-ion battery"],
        seller_id: null
      });
    }
    
    // Add trendy but less eco-friendly products with lower prices
    const hasFastFashionDress = data.some(product => product.title.includes("FastGlam Party Dress"));
    if (!hasFastFashionDress) {
      data.push({
        id: "fast-fashion-dress-001",
        title: "FastGlam Party Dress",
        description: "Trendy party dress with shimmer details. Perfect for a night out on the town. Limited edition design.",
        image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
        price: 999, // Cheaper price for less sustainable product
        sustainability_score: 3,
        eco_features: [],
        brand: "FastGlam",
        category: "Clothing",
        carbon_footprint: 25.8,
        created_at: new Date().toISOString(),
        materials: ["polyester", "plastic sequins", "synthetic fiber"],
        seller_id: null
      });
    }
    
    const hasDisposableCameraKit = data.some(product => product.title.includes("SnapQuick Disposable Camera Kit"));
    if (!hasDisposableCameraKit) {
      data.push({
        id: "disposable-camera-001",
        title: "SnapQuick Disposable Camera Kit",
        description: "Set of 3 disposable cameras with flash. Perfect for parties and events. 27 exposures each.",
        image_url: "https://images.unsplash.com/photo-1554136545-2f288e75dfe6?auto=format&fit=crop&w=800&q=80",
        price: 599, // Cheaper price for less sustainable product
        sustainability_score: 2,
        eco_features: [],
        brand: "SnapQuick",
        category: "Electronics",
        carbon_footprint: 18.6,
        created_at: new Date().toISOString(),
        materials: ["plastic", "electronic components", "batteries", "photographic chemicals"],
        seller_id: null
      });
    }
    
    const hasTrendyPlasticGlasses = data.some(product => product.title.includes("TrendEye Colorful Sunglasses Set"));
    if (!hasTrendyPlasticGlasses) {
      data.push({
        id: "plastic-glasses-001",
        title: "TrendEye Colorful Sunglasses Set",
        description: "Set of 5 colorful plastic sunglasses in different styles. Affordable fashion accessory for every outfit.",
        image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
        price: 399, // Cheaper price for less sustainable product
        sustainability_score: 2,
        eco_features: [],
        brand: "TrendEye",
        category: "Accessories",
        carbon_footprint: 12.4,
        created_at: new Date().toISOString(),
        materials: ["acrylic plastic", "metal hinges", "synthetic dyes"],
        seller_id: null
      });
    }
  }
  
  return data;
}

async function fetchCartItemsCount() {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) return 0;

  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.session.user.id);

  if (error) return 0;
  return count || 0;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: () => fetchProducts(searchTerm),
  });

  const { data: cartItemsCount = 0 } = useQuery({
    queryKey: ['cartItems'],
    queryFn: fetchCartItemsCount,
    refetchInterval: 5000,
  });

  const filteredProducts = selectedCategory === "All Products"
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (isLoading) return <div className="min-h-screen bg-eco-background flex items-center justify-center"><p className="text-lg text-gray-600">Loading products...</p></div>;
  if (error) return <div className="min-h-screen bg-eco-background flex items-center justify-center"><p className="text-lg text-red-600">Error loading products. Please try again later.</p></div>;

  return (
    <div className="min-h-screen bg-eco-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end items-center mb-6">
          <div className="flex gap-4">
            <Link 
              to="/scanner" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-eco-primary text-white hover:bg-eco-primary/90 transition-colors"
            >
              <Camera size={20} />
              <span>Scanner</span>
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-eco-primary text-white hover:bg-eco-primary/90 transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-eco-accent text-white"
                  variant="secondary"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-eco-primary text-white hover:bg-eco-primary/90 transition-colors"
            >
              <UserRound size={20} />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        <div className="text-center mb-8 animate-fade-in">
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

        <div className="relative w-full max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description || ''}
              image={product.image_url || ''}
              price={product.price}
              sustainabilityScore={product.sustainability_score}
              ecoFeatures={product.eco_features}
              brand={product.brand}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found. Try adjusting your search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
