
import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  productName: string;
  ecoScore: number;
  detectedMaterials?: string[];
}

const ProductHeader = ({ productName, ecoScore, detectedMaterials }: ProductHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mt-1">Analyzing: {productName}</p>
        
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
      <div>
        <Badge className={`${ecoScore > 7 ? 'bg-green-500' : ecoScore > 4 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
          Eco Score: {ecoScore.toFixed(1)}/10
        </Badge>
      </div>
    </div>
  );
};

export default ProductHeader;
