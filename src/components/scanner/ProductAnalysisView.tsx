
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialAnalysis from "@/components/MaterialAnalysis";
import { ArrowLeft, AlertCircle, Leaf, Droplets, Recycle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductAnalysisViewProps {
  productId: string;
  onBack: () => void;
}

interface AnalysisResult {
  materials: Array<{
    name: string;
    percentage: number;
    eco_score: number;
    sustainable: boolean;
    details: string;
  }>;
  eco_score: number;
  warnings: string[];
  recommendations: string[];
  metrics: {
    water_saved: number;
    energy_efficiency: number;
    biodegradable_percentage: number;
  };
}

const ProductAnalysisView = ({ productId, onBack }: ProductAnalysisViewProps) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const { data: scanHistory, isLoading } = useQuery({
    queryKey: ['scan-history', productId],
    queryFn: async () => {
      const { data } = await supabase
        .from('material_scans')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      return data;
    }
  });
  
  useEffect(() => {
    // Generate mock analysis result if we don't have real data yet
    if (!analysisResult) {
      const mockResult: AnalysisResult = {
        materials: [
          { 
            name: "Palm Oil", 
            percentage: 15, 
            eco_score: 3, 
            sustainable: false, 
            details: "High deforestation impact, often causes habitat destruction" 
          },
          { 
            name: "Wheat Flour", 
            percentage: 55, 
            eco_score: 7, 
            sustainable: true, 
            details: "Generally sustainable, but water intensive in some regions" 
          },
          { 
            name: "Artificial Colors", 
            percentage: 2, 
            eco_score: 4, 
            sustainable: false, 
            details: "Chemical processing with potential environmental impacts" 
          },
          { 
            name: "Salt", 
            percentage: 8, 
            eco_score: 6, 
            sustainable: true, 
            details: "Natural mineral, but mining can have local impacts" 
          },
          { 
            name: "Spices", 
            percentage: 20, 
            eco_score: 8, 
            sustainable: true, 
            details: "Generally sustainably grown with lower environmental impact" 
          }
        ],
        eco_score: 6.2,
        warnings: [
          "Contains palm oil which is linked to deforestation",
          "Artificial colors may have environmental production impacts",
          "High sodium content has both health and water usage impacts"
        ],
        recommendations: [
          "Look for alternatives with no palm oil",
          "Choose products with natural colors instead of artificial ones",
          "Check for sustainability certifications on packaging"
        ],
        metrics: {
          water_saved: 750,
          energy_efficiency: 25,
          biodegradable_percentage: 83
        }
      };
      
      setAnalysisResult(mockResult);
    }
  }, [analysisResult]);
  
  // Function to fetch detailed analysis from Supabase Edge Function
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await supabase.functions.invoke('analyze-materials', {
          body: { 
            image: "fetch-only",
            productId: productId
          }
        });
        
        if (data && data.success) {
          setAnalysisResult(data);
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
      }
    };
    
    fetchAnalysis();
  }, [productId]);

  if (isLoading || !analysisResult) {
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

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Material Analysis</CardTitle>
            <CardDescription>Detailed breakdown of materials and their environmental impact</CardDescription>
          </div>
          <div>
            <Badge className={`${analysisResult.eco_score > 7 ? 'bg-green-500' : analysisResult.eco_score > 4 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
              Eco Score: {analysisResult.eco_score.toFixed(1)}/10
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 space-y-6">
        {/* Overall sustainability score */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Sustainability Score</h3>
          <Progress 
            value={analysisResult.eco_score * 10} 
            className="h-2.5" 
            indicatorClassName={`${analysisResult.eco_score > 7 ? 'bg-green-500' : analysisResult.eco_score > 4 ? 'bg-amber-500' : 'bg-red-500'}`} 
          />
          <p className="text-sm text-gray-600">
            This product has {analysisResult.eco_score > 7 ? 'good' : analysisResult.eco_score > 4 ? 'moderate' : 'poor'} sustainability metrics
          </p>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-md text-center">
            <Leaf className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs font-medium">Biodegradable</p>
            <p className="text-lg font-bold text-green-600">{analysisResult.metrics.biodegradable_percentage}%</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md text-center">
            <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs font-medium">Water Saved</p>
            <p className="text-lg font-bold text-blue-600">{analysisResult.metrics.water_saved}ml</p>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md text-center">
            <Recycle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xs font-medium">Energy Efficient</p>
            <p className="text-lg font-bold text-amber-600">{analysisResult.metrics.energy_efficiency}%</p>
          </div>
        </div>
        
        {/* Materials breakdown */}
        <div className="space-y-3">
          <h3 className="text-md font-medium">Materials Breakdown</h3>
          {analysisResult.materials.map((material, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{material.name}</span>
                <Badge variant={material.sustainable ? "outline" : "secondary"} className={material.sustainable ? "border-green-500 text-green-700" : "bg-gray-200 text-gray-700"}>
                  {material.sustainable ? "Sustainable" : "Less Sustainable"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-16">{material.percentage}%</span>
                <Progress 
                  value={material.percentage} 
                  className="h-2 flex-1" 
                  indicatorClassName={material.eco_score > 7 ? 'bg-green-500' : material.eco_score > 4 ? 'bg-amber-500' : 'bg-red-500'} 
                />
              </div>
              
              <p className="text-xs text-gray-600">{material.details}</p>
            </div>
          ))}
        </div>
        
        {/* Warnings */}
        {analysisResult.warnings.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-md font-medium">Environmental Concerns</h3>
            <div className="bg-red-50 border border-red-100 rounded-md p-3">
              <ul className="space-y-2">
                {analysisResult.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Recommendations */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Sustainability Recommendations</h3>
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <ul className="space-y-2">
              {analysisResult.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                  <Leaf className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Traditional Analysis Component */}
        <div className="pt-4 border-t border-gray-200">
          <MaterialAnalysis productId={productId} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 px-0 pb-0">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductAnalysisView;
