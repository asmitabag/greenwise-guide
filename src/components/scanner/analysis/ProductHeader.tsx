
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
  
  // Filter out duplicate and similar materials for cleaner display
  const getFilteredMaterials = () => {
    if (!detectedMaterials || detectedMaterials.length === 0) return [];
    
    const uniqueMaterials = new Set<string>();
    const filteredList: string[] = [];
    
    detectedMaterials.forEach(material => {
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
