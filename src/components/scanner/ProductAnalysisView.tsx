
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductAnalysis } from "./hooks/useProductAnalysis";
import ProductHeader from "./analysis/ProductHeader";
import MetricsDisplay from "./analysis/MetricsDisplay";
import MaterialList from "./analysis/MaterialList";
import AnalysisWarnings from "./analysis/AnalysisWarnings";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductAnalysisViewProps {
  productId: string;
  onBack: () => void;
}

const ProductAnalysisView = ({ productId, onBack }: ProductAnalysisViewProps) => {
  const {
    materials,
    certifications,
    materialsLoading,
    materialsError,
    productName,
  } = useProductAnalysis(productId);

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
    return (
      <Card className="p-4 bg-red-50">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          <p>Error loading material data. Please try again.</p>
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
        </div>
      </Card>
    );
  }

  const overallEcoScore = materials.reduce((acc, material) => {
    return acc + (material.eco_score * (material.percentage / 100));
  }, 0);

  const detectedMaterials = sessionStorage.getItem('detectedMaterials') 
    ? JSON.parse(sessionStorage.getItem('detectedMaterials')!) 
    : [];

  const warnings = materials
    .filter(m => m.eco_score < 4)
    .map(m => `Contains non-sustainable ${m.name.toLowerCase()} which may have environmental impact`);

  if (detectedMaterials.some((m: string) => m.toLowerCase().includes('plastic'))) {
    warnings.push("Contains plastic which is non-biodegradable and contributes to pollution");
  }

  const recommendations = [
    "Consider products with higher percentage of sustainable materials",
    "Look for recycled or biodegradable alternatives",
    "Check for eco-certifications when purchasing similar products"
  ];

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
