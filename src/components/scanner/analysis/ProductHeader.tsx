
import { Badge } from "@/components/ui/badge";
import { getProductImage } from "../utils/product-utils";

interface ProductHeaderProps {
  productName: string;
  ecoScore: number;
  productType?: string;
  detectedMaterials?: string[];
}

const ProductHeader = ({ productName, ecoScore, productType, detectedMaterials }: ProductHeaderProps) => {
  const productImage = productType ? getProductImage(productType) : null;
  
  // Determine eco score color based on the score
  const getEcoScoreColor = (score: number) => {
    if (score > 7) return 'bg-green-500 text-white';
    if (score > 4) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  // Format the score to ensure it's always displayed correctly
  const formattedScore = isNaN(ecoScore) ? "N/A" : ecoScore.toFixed(1);
  
  // Format material names to be more readable
  const formatMaterialName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get product-specific materials if detected materials aren't provided
  const getProductSpecificMaterials = (): string[] => {
    if (detectedMaterials && detectedMaterials.length > 0) {
      return detectedMaterials;
    }
    
    // Default materials based on product type if no detected materials
    if (productType) {
      switch (productType) {
        case "recycled-ocean-plastic-shoes":
          return ["Recycled Ocean Plastic", "Natural Rubber", "Organic Cotton"];
        case "biodegradable-bamboo-toothbrush":
          return ["Bamboo", "Plant-Based Bristles", "Compostable Packaging"];
        case "solar-power-bank-001":
        case "solar-power-bank":
        case "5":
          return ["Recycled Aluminum", "Silicon Solar Panels", "Lithium-ion Battery"];
        case "recycled-coffee-cup":
        case "4":
          return ["Recycled Paper", "Plant-based Lining", "Vegetable Inks"];
        case "natural-face-cream":
        case "3":
          return ["Aloe Vera Extract", "Shea Butter", "Coconut Oil", "Natural Preservatives"];
        case "organic-cotton-shirt":
        case "2":
          return ["Organic Cotton", "Natural Dyes", "Elastane"];
        case "bamboo-water-bottle":
        case "1":
          return ["Bamboo", "Stainless Steel", "Silicone"];
        case "fast-fashion-dress-001":
          return ["Polyester", "Plastic Sequins", "Synthetic Fiber"];
        case "disposable-camera-001":
          return ["Plastic Housing", "Electronic Components", "Batteries"];
        case "plastic-glasses-001":
          return ["Acrylic Plastic", "Metal Hinges", "Synthetic Dyes"];
        case "perfume":
          return ["Alcohol (Denatured)", "Perfume Compounds", "Linalool", "Citral"];
        default:
          return [];
      }
    }
    
    // Materials based on product name
    if (productName) {
      const lowerName = productName.toLowerCase();
      if (lowerName.includes("toothbrush")) {
        return ["Bamboo", "Plant-Based Bristles", "Compostable Packaging"];
      } else if (lowerName.includes("shoes") || lowerName.includes("footwear")) {
        return ["Recycled Ocean Plastic", "Natural Rubber", "Organic Cotton"];
      } else if (lowerName.includes("power") || lowerName.includes("solar")) {
        return ["Recycled Aluminum", "Silicon Solar Panels", "Lithium-ion Battery"];
      } else if (lowerName.includes("coffee") || lowerName.includes("cup")) {
        return ["Recycled Paper", "Plant-based Lining", "Vegetable Inks"];
      } else if (lowerName.includes("face") || lowerName.includes("cream")) {
        return ["Aloe Vera Extract", "Shea Butter", "Coconut Oil", "Natural Preservatives"];
      } else if (lowerName.includes("cotton") || lowerName.includes("shirt")) {
        return ["Organic Cotton", "Natural Dyes", "Elastane"];
      } else if (lowerName.includes("bottle") || lowerName.includes("bamboo")) {
        return ["Bamboo", "Stainless Steel", "Silicone"];
      } else if (lowerName.includes("dress") || lowerName.includes("fashion")) {
        return ["Polyester", "Plastic Sequins", "Synthetic Fiber"];
      } else if (lowerName.includes("camera") || lowerName.includes("disposable")) {
        return ["Plastic Housing", "Electronic Components", "Batteries"];
      } else if (lowerName.includes("glass") || lowerName.includes("sunglass")) {
        return ["Acrylic Plastic", "Metal Hinges", "Synthetic Dyes"];
      } else if (lowerName.includes("perfume") || lowerName.includes("fragrance")) {
        return ["Alcohol (Denatured)", "Perfume Compounds", "Linalool", "Citral"];
      }
    }
    
    return [];
  };
  
  // Filter out duplicate and similar materials for cleaner display
  const getFilteredMaterials = () => {
    const materialsList = detectedMaterials && detectedMaterials.length > 0 
      ? detectedMaterials 
      : getProductSpecificMaterials();
    
    if (!materialsList || materialsList.length === 0) return [];
    
    const uniqueMaterials = new Set<string>();
    const filteredList: string[] = [];
    
    materialsList.forEach(material => {
      // Normalize the material name to avoid similar duplicates
      const normalizedName = material.toLowerCase().trim();
      
      // Check if we've already added a similar material
      const isSimilarToExisting = Array.from(uniqueMaterials).some(existing => 
        normalizedName.includes(existing) || existing.includes(normalizedName)
      );
      
      if (!isSimilarToExisting) {
        uniqueMaterials.add(normalizedName);
        filteredList.push(formatMaterialName(material));
      }
    });
    
    return filteredList;
  };
  
  const filteredMaterials = getFilteredMaterials();
  
  // Choose product image based on product name if not provided by type
  const getImageFromName = () => {
    if (productName.includes("Disposable Camera") || productName.includes("SnapQuick")) {
      return "https://images.unsplash.com/photo-1554136545-2f288e75dfe6?auto=format&fit=crop&w=800&q=80";
    }
    if (productName.includes("FastGlam") || productName.includes("Party Dress")) {
      return "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80";
    }
    if (productName.includes("Sunglasses") || productName.includes("TrendEye")) {
      return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80";
    }
    if (productName.includes("Solar") || productName.includes("Power Bank")) {
      return "https://images.unsplash.com/photo-1594131975464-8a26d4ad3f7f?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    if (productName.includes("Face Cream") || productName.includes("Natural Face")) {
      return "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    if (productName.includes("Cotton") || productName.includes("T-shirt")) {
      return "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    if (productName.includes("Perfume") || productName.includes("Fragrance")) {
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    if (productName.includes("Bamboo") || productName.includes("Toothbrush")) {
      return "https://images.unsplash.com/photo-1559674398-1e2f98a8f8f3?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    if (productName.includes("Shoes") || productName.includes("Footwear")) {
      return "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    if (productName.includes("Coffee") || productName.includes("Cup")) {
      return "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    }
    return null;
  };
  
  // Use product image from type or from name if available
  const finalProductImage = productImage || getImageFromName();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-4 items-center">
        {finalProductImage && (
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
            <img src={finalProductImage} alt={productName} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <p className="text-lg font-medium">{productName}</p>
          <p className="text-sm text-gray-600 mt-1">Sustainability Analysis</p>
          
          {filteredMaterials.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500">Detected Materials:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {filteredMaterials.map((material, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <Badge className={getEcoScoreColor(ecoScore)}>
          Eco Score: {formattedScore}/10
        </Badge>
      </div>
    </div>
  );
};

export default ProductHeader;
