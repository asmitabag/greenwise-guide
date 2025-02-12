
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const categories = [
  "All Products",
  "Home & Living",
  "Fashion",
  "Beauty",
  "Food & Beverages",
  "Electronics",
];

interface CategoriesProps {
  selected: string;
  onSelect: (category: string) => void;
}

export const Categories = ({ selected, onSelect }: CategoriesProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-8 animate-slide-in">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          className={`whitespace-nowrap ${
            selected === category
              ? "bg-eco-primary text-white"
              : "text-eco-secondary hover:bg-eco-muted"
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
