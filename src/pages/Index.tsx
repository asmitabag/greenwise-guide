
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Categories } from "@/components/Categories";
import { motion } from "framer-motion";

// Mock data for demonstration
const products = [
  {
    id: 1,
    title: "Bamboo Toothbrush Set",
    description: "Eco-friendly bamboo toothbrushes with biodegradable packaging",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=500",
    price: 12.99,
    sustainabilityScore: 9,
    ecoFeatures: ["organic", "recyclable"],
    category: "Home & Living"
  },
  {
    id: 2,
    title: "Organic Cotton T-Shirt",
    description: "100% organic cotton t-shirt made with sustainable practices",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=500",
    price: 29.99,
    sustainabilityScore: 8,
    ecoFeatures: ["organic", "water-saving"],
    category: "Fashion"
  },
  {
    id: 3,
    title: "Reusable Water Bottle",
    description: "Stainless steel water bottle with zero plastic",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=500",
    price: 24.99,
    sustainabilityScore: 10,
    ecoFeatures: ["recyclable"],
    category: "Home & Living"
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const filteredProducts = selectedCategory === "All Products"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-eco-background">
      <div className="container mx-auto px-4 py-8">
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
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
