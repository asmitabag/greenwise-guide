
import { Badge } from "@/components/ui/badge";
import { getProductImage } from "../utils/product-utils";

interface ProductHeaderProps {
  productName: string;
  ecoScore: number;
  productType?: string;
  detectedMaterials?: string[];
}

const ProductHeader = ({ productName, ecoScore, productType, detectedMaterials }: ProductHeaderProps) => {
  // If plastic or synthetic materials are detected, override the product image to show a plastic product
  const hasPlastic = detectedMaterials?.some(m => 
    m.toLowerCase().includes('plastic') || 
    m.toLowerCase().includes('polymer') || 
    m.toLowerCase().includes('synthetic')
  );
  
  // Get appropriate product image based on detected materials or product type
  const getAppropriateImage = () => {
    if (hasPlastic) {
      return "/public/lovable-uploads/1a349db0-2346-42a3-838e-5c11d7c9da16.png";
    }
    
    if (detectedMaterials?.some(m => m.toLowerCase().includes('glass'))) {
      return "/public/lovable-uploads/d6717a4c-0b64-4aea-b65a-a641b57b6eef.png";
    }
    
    // If no specific material is detected, use the product type image
    return productType ? getProductImage(productType) : null;
  };
  
  const productImage = getAppropriateImage();
  
  // Determine eco score color based on the score
  const getEcoScoreColor = (score: number) => {
    if (score > 7) return 'bg-green-500 text-white';
    if (score > 4) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
        {productImage && (
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <p className="text-lg font-medium">{productName}</p>
          <p className="text-sm text-gray-600 mt-1">Sustainability Analysis</p>
          
          {detectedMaterials && detectedMaterials.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500">Detected Materials:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {detectedMaterials.map((material, index) => (
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
          Eco Score: {ecoScore.toFixed(1)}/10
        </Badge>
      </div>
    </div>
  );
};

export default ProductHeader;
