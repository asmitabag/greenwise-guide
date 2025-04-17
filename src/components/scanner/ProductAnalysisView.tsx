
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialAnalysis from "@/components/MaterialAnalysis";
import { ArrowLeft, AlertCircle, Leaf, Droplets, Recycle, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

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

// Product descriptions for additional context
const productDescriptions = {
  "1": "Bamboo Water Bottle",
  "2": "Organic Cotton T-shirt",
  "3": "Natural Face Cream",
  "4": "Recycled Coffee Cup",
  "5": "Solar Power Bank",
  "perfume": "Fragrance",
  "plastic": "Plastic Product"
};

// Product material mappings - ensuring correct materials per product
const productMaterialMappings = {
  "1": [ // Bamboo Water Bottle
    { name: "Bamboo", percentage: 70, eco_score: 8.5, sustainable: true, details: "Sustainable, fast-growing natural material" },
    { name: "Stainless Steel", percentage: 25, eco_score: 6.0, sustainable: true, details: "Durable and recyclable metal components" },
    { name: "Silicone", percentage: 5, eco_score: 5.0, sustainable: false, details: "Used for seals and gaskets" }
  ],
  "2": [ // Organic Cotton T-shirt
    { name: "Organic Cotton", percentage: 95, eco_score: 7.5, sustainable: true, details: "Grown without synthetic pesticides or fertilizers" },
    { name: "Natural Dyes", percentage: 5, eco_score: 8.0, sustainable: true, details: "Plant-based coloring with low environmental impact" }
  ],
  "3": [ // Natural Face Cream
    { name: "Aloe Vera Extract", percentage: 40, eco_score: 9.0, sustainable: true, details: "Natural moisturizing ingredient" },
    { name: "Shea Butter", percentage: 30, eco_score: 8.5, sustainable: true, details: "Natural plant-based emollient" },
    { name: "Coconut Oil", percentage: 20, eco_score: 7.0, sustainable: true, details: "Natural oil with multiple skin benefits" },
    { name: "Natural Preservatives", percentage: 10, eco_score: 6.5, sustainable: true, details: "Plant-derived preservation system" }
  ],
  "4": [ // Recycled Coffee Cup
    { name: "Recycled Paper", percentage: 85, eco_score: 7.0, sustainable: true, details: "Made from post-consumer waste paper" },
    { name: "Plant-based Lining", percentage: 10, eco_score: 8.0, sustainable: true, details: "Biodegradable alternative to plastic lining" },
    { name: "Vegetable Inks", percentage: 5, eco_score: 8.5, sustainable: true, details: "Non-toxic printing materials" }
  ],
  "5": [ // Solar Power Bank
    { name: "Recycled Aluminum", percentage: 40, eco_score: 7.0, sustainable: true, details: "Durable casing made from post-consumer aluminum" },
    { name: "Silicon Solar Panel", percentage: 20, eco_score: 6.0, sustainable: true, details: "Renewable energy technology with medium production impact" },
    { name: "Lithium-ion Battery", percentage: 35, eco_score: 4.0, sustainable: false, details: "Energy storage with significant environmental concerns" },
    { name: "Recycled Plastic", percentage: 5, eco_score: 5.0, sustainable: true, details: "Used for smaller components" }
  ],
  "perfume": [ // Fragrance
    { name: "Alcohol", percentage: 80, eco_score: 5.0, sustainable: false, details: "Main carrier for fragrance compounds" },
    { name: "Essential Oils", percentage: 15, eco_score: 7.0, sustainable: true, details: "Natural fragrance compounds from plants" },
    { name: "Glass Bottle", percentage: 5, eco_score: 6.5, sustainable: true, details: "Recyclable container material" }
  ],
  "plastic": [ // Generic plastic product
    { name: "Plastic", percentage: 100, eco_score: 2.0, sustainable: false, details: "Non-biodegradable petroleum-based material with high environmental impact" }
  ]
};

const ProductAnalysisView = ({ productId, onBack }: ProductAnalysisViewProps) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  
  // Try to get detected materials from session storage
  useEffect(() => {
    try {
      const materials = sessionStorage.getItem('detectedMaterials');
      if (materials) {
        const parsedMaterials = JSON.parse(materials);
        if (Array.isArray(parsedMaterials) && parsedMaterials.length > 0) {
          setDetectedMaterials(parsedMaterials);
          console.log("Retrieved materials from session storage:", parsedMaterials);
        }
      }
    } catch (e) {
      console.error("Error retrieving materials from session storage:", e);
    }
  }, []);
  
  // Determine product key for material mapping
  const determineProductKey = (id: string): string => {
    // Direct matches for product IDs
    if (id === "1" || id === "2" || id === "3" || id === "4" || id === "5" || id === "perfume" || id === "plastic") {
      return id;
    }
    
    // Check for numeric IDs (e.g., "solar-power-bank-001" should map to "5")
    if (id.includes("solar") || id.includes("power") || id.includes("bank")) {
      return "5";
    }
    if (id.includes("bottle") || id.includes("bamboo") || id.includes("water")) {
      return "1";
    }
    if (id.includes("shirt") || id.includes("cotton") || id.includes("tee")) {
      return "2";
    }
    if (id.includes("cream") || id.includes("face") || id.includes("lotion")) {
      return "3";
    }
    if (id.includes("coffee") || id.includes("cup")) {
      return "4";
    }
    if (id.includes("perfume") || id.includes("fragrance") || id.includes("cologne")) {
      return "perfume";
    }
    
    // Default for unknown products
    return detectedMaterials.includes("plastic") ? "plastic" : "5";
  };
  
  const productKey = determineProductKey(productId);
  
  // Get product description for display
  const determineProductName = (id: string): string => {
    // Check if we have a direct match in our description mapping
    if (productDescriptions[id as keyof typeof productDescriptions]) {
      return productDescriptions[id as keyof typeof productDescriptions];
    }
    
    // Check for keywords in the ID
    if (id.includes("bottle") || id.includes("bamboo")) return "Bamboo Water Bottle";
    if (id.includes("shirt") || id.includes("cotton")) return "Organic Cotton T-shirt";
    if (id.includes("cream") || id.includes("face")) return "Natural Face Cream";
    if (id.includes("coffee") || id.includes("cup")) return "Recycled Coffee Cup";
    if (id.includes("power") || id.includes("solar")) return "Solar Power Bank";
    if (id.includes("perfume") || id.includes("fragrance")) return "Fragrance";
    if (id.includes("plastic")) return "Plastic Product";
    
    // If no match is found, try to use detected materials to determine product type
    if (detectedMaterials.length > 0) {
      return `Scanned Product (${detectedMaterials[0]})`;
    }
    
    return "Unknown Product";
  };
  
  let productName = determineProductName(productId);
  
  // If we have detected materials, override the product name
  if (detectedMaterials.length > 0) {
    productName = `Scanned Product (${detectedMaterials.join(", ")})`;
  }
  
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
  
  // Generate analysis result based on product key
  useEffect(() => {
    // Get material data from our mappings
    let materials = productMaterialMappings[productKey as keyof typeof productMaterialMappings] || [];
    
    // If we have detected materials from OCR, override with a custom material list
    if (detectedMaterials.length > 0) {
      // Create custom materials based on detected materials
      materials = detectedMaterials.map((material, index) => {
        // Determine eco score based on material type
        let ecoScore = 5.0; // Default medium score
        let sustainable = false;
        
        // Simple logic to assign eco-scores
        const lowerCaseMaterial = material.toLowerCase();
        if (lowerCaseMaterial.includes('plastic')) {
          ecoScore = 2.0;
          sustainable = false;
        } else if (lowerCaseMaterial.includes('recycled')) {
          ecoScore = 7.0;
          sustainable = true;
        } else if (lowerCaseMaterial.includes('bamboo') || lowerCaseMaterial.includes('organic')) {
          ecoScore = 8.5;
          sustainable = true;
        } else if (lowerCaseMaterial.includes('paper')) {
          ecoScore = 6.0;
          sustainable = true;
        } else if (lowerCaseMaterial.includes('cotton')) {
          ecoScore = 7.0;
          sustainable = true;
        } else if (lowerCaseMaterial.includes('glass')) {
          ecoScore = 6.5;
          sustainable = true;
        } else if (lowerCaseMaterial.includes('metal') || lowerCaseMaterial.includes('steel') || lowerCaseMaterial.includes('aluminum')) {
          ecoScore = 6.0;
          sustainable = true;
        }
        
        // Equal distribution of percentages if multiple materials
        const percentage = Math.floor(100 / detectedMaterials.length);
        
        return {
          name: material,
          percentage: percentage,
          eco_score: ecoScore,
          sustainable: sustainable,
          details: `Detected material through image analysis`
        };
      });
    }
    
    // Calculate overall eco score from materials
    const overallEcoScore = materials.reduce((acc, material) => {
      return acc + (material.eco_score * (material.percentage / 100));
    }, 0);
    
    // Generate appropriate warnings based on materials
    const warnings: string[] = [];
    materials.forEach(material => {
      if (material.eco_score < 4 && !warnings.includes(`Contains non-sustainable ${material.name.toLowerCase()}`)) {
        warnings.push(`Contains non-sustainable ${material.name.toLowerCase()} which may have environmental impact`);
      }
    });
    
    // Add a warning for plastic
    if (detectedMaterials.some(m => m.toLowerCase().includes('plastic'))) {
      warnings.push("Contains plastic which is non-biodegradable and contributes to pollution");
    }
    
    // Generate recommendations
    const recommendations: string[] = [
      "Consider products with higher percentage of sustainable materials",
      "Look for recycled or biodegradable alternatives",
      "Check for eco-certifications when purchasing similar products"
    ];
    
    // Generate metrics based on eco score
    const metrics = {
      biodegradable_percentage: Math.floor(overallEcoScore * 10), // Higher eco score = more biodegradable
      water_saved: Math.floor(overallEcoScore * 100), // Higher eco score = more water saved
      energy_efficiency: Math.floor(overallEcoScore * 10) // Higher eco score = more energy efficient
    };
    
    setAnalysisResult({
      materials,
      eco_score: Number(overallEcoScore.toFixed(1)),
      warnings,
      recommendations,
      metrics
    });
    
  }, [productKey, detectedMaterials]);

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
            <p className="text-sm text-gray-600 mt-1">Analyzing: {productName}</p>
            
            {detectedMaterials.length > 0 && (
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
                  {material.percentage}% | {material.sustainable ? "Sustainable" : "Less Sustainable"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-16">Eco Score:</span>
                <Progress 
                  value={material.eco_score * 10} 
                  className="h-2 flex-1" 
                  indicatorClassName={material.eco_score > 7 ? 'bg-green-500' : material.eco_score > 4 ? 'bg-amber-500' : 'bg-red-500'} 
                />
                <span className="text-sm font-medium">{material.eco_score}/10</span>
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
