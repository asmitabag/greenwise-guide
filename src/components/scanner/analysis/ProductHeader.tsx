
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
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-4 items-center">
        {productImage && (
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
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
