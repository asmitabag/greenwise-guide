
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductAnalysis } from "./hooks/useProductAnalysis";
import ProductHeader from "./analysis/ProductHeader";
import MetricsDisplay from "./analysis/MetricsDisplay";
import MaterialList from "./analysis/MaterialList";
import AnalysisWarnings from "./analysis/AnalysisWarnings";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { determineProductKey } from "./utils/product-utils";

interface ProductAnalysisViewProps {
  productId: string;
  onBack: () => void;
}

const ProductAnalysisView = ({ productId, onBack }: ProductAnalysisViewProps) => {
  const { toast } = useToast();
  
  // Normalize productId to help with accurate product identification
  const normalizedProductId = (productId || "").toLowerCase().trim();
  const productKey = determineProductKey(normalizedProductId);
  
  console.log("ProductAnalysisView: Using product key:", productKey, "for ID:", normalizedProductId);
  
  const {
    materials,
    certifications,
    materialsLoading,
    materialsError,
    productName,
    productType,
    refetch
  } = useProductAnalysis(productKey);

  // Automatically refetch data when productId changes
  useEffect(() => {
    if (productId) {
      console.log("ProductAnalysisView: Refetching data for product ID:", productId);
      refetch();
    }
  }, [productId, refetch]);

  // Get the detected materials from session storage
  const getDetectedMaterials = () => {
    try {
      const storedMaterials = sessionStorage.getItem('detectedMaterials');
      return storedMaterials ? JSON.parse(storedMaterials) : [];
    } catch (error) {
      console.error("Error retrieving detected materials from session storage:", error);
      return [];
    }
  };

  if (materialsLoading) {
    return (
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl">Material Analysis</CardTitle>
          <CardDescription>Loading analysis results...</CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (materialsError) {
    console.error("Material analysis error:", materialsError);
    return (
      <Card className="p-4 bg-red-50">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <p>Error loading material data. Please try again.</p>
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
          >
            Retry Analysis
          </Button>
        </div>
      </Card>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Leaf className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No material data available</h3>
          <p className="text-sm text-gray-500 mt-1">
            This product hasn't been analyzed yet or no material data is available.
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4"
          >
            Retry Analysis
          </Button>
        </div>
      </Card>
    );
  }

  const overallEcoScore = materials.reduce((acc, material) => {
    return acc + (material.eco_score * (material.percentage / 100));
  }, 0);

  const detectedMaterials = getDetectedMaterials();

  // Generate warnings based on materials
  const generateWarnings = () => {
    const warnings: string[] = [];
    
    // Add warnings for low eco-score materials
    materials
      .filter(m => m.eco_score < 4)
      .forEach(m => {
        warnings.push(`Contains non-sustainable ${m.name.toLowerCase()} which may have environmental impact`);
      });
    
    // Add specific warnings based on product type
    if (productType === 'fast-fashion-dress-001') {
      warnings.push("Fast fashion products have a high environmental impact and short lifespan");
      warnings.push("Synthetic fabrics shed microplastics during washing that pollute waterways");
    } else if (productType === 'disposable-camera-001') {
      warnings.push("Single-use electronics contribute significantly to e-waste");
      warnings.push("Contains batteries which require special disposal to prevent chemical leaching");
    } else if (productType === 'plastic-glasses-001') {
      warnings.push("Acrylic plastics are derived from non-renewable petroleum resources");
    } else if (productType === 'solar-power-bank-001' || productType === '5') {
      warnings.push("Contains lithium-ion battery that requires special disposal");
      warnings.push("Electronic components can contain rare metals with environmental mining impacts");
    } else if (productType === 'recycled-ocean-plastic-shoes') {
      warnings.push("Contains some synthetic components that will not biodegrade");
    } else if (productType.includes('plastic') || detectedMaterials.some(m => m.toLowerCase().includes('plastic'))) {
      warnings.push("Contains plastic which is non-biodegradable and contributes to pollution");
    }
    
    return warnings;
  };

  // Generate appropriate recommendations based on the product
  const generateRecommendations = () => {
    const recommendations: string[] = [];
    
    // Generic recommendations for all products
    recommendations.push("Consider products with higher percentage of sustainable materials");
    
    // Product-specific recommendations
    if (productType === 'fast-fashion-dress-001') {
      recommendations.push("Look for clothing made from natural or recycled fibers");
      recommendations.push("Invest in durable pieces with timeless designs rather than trendy items");
    } else if (productType === 'disposable-camera-001') {
      recommendations.push("Use digital cameras or smartphones instead of disposable cameras");
      recommendations.push("If analog is preferred, consider a reusable film camera instead");
    } else if (productType === 'plastic-glasses-001') {
      recommendations.push("Consider sunglasses made from sustainable materials like wood or recycled materials");
    } else if (productType === 'solar-power-bank-001' || productType === '5') {
      recommendations.push("Look for devices with replaceable batteries to extend life");
      recommendations.push("Consider solar chargers without integrated batteries");
    } else if (productType === 'recycled-ocean-plastic-shoes') {
      recommendations.push("Look for shoes with biodegradable soles and natural fiber uppers");
    } else if (productType.includes('plastic')) {
      recommendations.push("Look for products made from biodegradable or recycled alternatives");
    } else {
      recommendations.push("Check for eco-certifications when purchasing similar products");
      recommendations.push("Research brands committed to sustainability and ethical production");
    }
    
    return recommendations;
  };

  const warnings = generateWarnings();
  const recommendations = generateRecommendations();

  const metrics = {
    biodegradable_percentage: Math.floor(overallEcoScore * 10),
    water_saved: Math.floor(overallEcoScore * 100),
    energy_efficiency: Math.floor(overallEcoScore * 10)
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Material Analysis</CardTitle>
        <CardDescription>Detailed breakdown of materials and their environmental impact</CardDescription>
        <ProductHeader 
          productName={productName}
          ecoScore={overallEcoScore}
          productType={productType}
          detectedMaterials={detectedMaterials}
        />
      </CardHeader>
      
      <CardContent className="p-0 space-y-6">
        <MetricsDisplay ecoScore={overallEcoScore} metrics={metrics} />
        
        <div className="space-y-3">
          <h3 className="text-md font-medium">Materials Breakdown</h3>
          {materials.map((material) => (
            <MaterialList 
              key={material.id} 
              material={material} 
              certifications={certifications}
            />
          ))}
        </div>
        
        <AnalysisWarnings warnings={warnings} recommendations={recommendations} />
      </CardContent>
      
      <CardFooter className="pt-4 px-0 pb-0 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home size={18} />
            <span>Back to Home</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductAnalysisView;
