
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Leaf, Recycle, Droplets } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  price: number;
  sustainabilityScore: number;
  ecoFeatures: string[];
}

export const ProductCard = ({
  title,
  description,
  image,
  price,
  sustainabilityScore,
  ecoFeatures,
}: ProductCardProps) => {
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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-eco-secondary mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex gap-2 mb-4">
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
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-eco-secondary">
            ${price.toFixed(2)}
          </span>
          <button className="px-4 py-2 bg-eco-primary text-white rounded-md hover:bg-eco-accent transition-colors duration-200">
            Learn More
          </button>
        </div>
      </div>
    </Card>
  );
};
