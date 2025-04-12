import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Recycle, Timer, Leaf, AlertCircle } from "lucide-react";

interface MaterialAnalysisProps {
  productId: string;
}

interface MaterialAnalysis {
  id: string;
  material_name: string;
  eco_score: number;
  impact_description: string;
  carbon_footprint: number;
  water_usage: number;
  recyclability_rating: number;
  biodegradability_rating: number;
  certification_ids: string[];
  product_id: string;
}

interface Certification {
  id: string;
  name: string;
  issuing_body: string;
  description: string;
}

const predefinedMaterials: Record<string, MaterialAnalysis[]> = {
  "1": [
    {
      id: "1-1",
      material_name: "Bamboo",
      eco_score: 9,
      impact_description: "Rapidly renewable plant-based material with minimal environmental impact",
      carbon_footprint: 0.5,
      water_usage: 30,
      recyclability_rating: 8,
      biodegradability_rating: 9,
      certification_ids: ["cert-1", "cert-3"],
      product_id: "1"
    },
    {
      id: "1-2",
      material_name: "Stainless Steel",
      eco_score: 7,
      impact_description: "Durable and recyclable metal for insulation liner",
      carbon_footprint: 2.1,
      water_usage: 50,
      recyclability_rating: 9,
      biodegradability_rating: 2,
      certification_ids: ["cert-2"],
      product_id: "1"
    },
    {
      id: "1-3",
      material_name: "Silicone",
      eco_score: 6,
      impact_description: "Used for seals and lid components",
      carbon_footprint: 3.2,
      water_usage: 80,
      recyclability_rating: 5,
      biodegradability_rating: 2,
      certification_ids: [],
      product_id: "1"
    }
  ],
  "2": [
    {
      id: "2-1",
      material_name: "Organic Cotton",
      eco_score: 8,
      impact_description: "Grown without synthetic pesticides or fertilizers",
      carbon_footprint: 1.2,
      water_usage: 180,
      recyclability_rating: 7,
      biodegradability_rating: 9,
      certification_ids: ["cert-1", "cert-4"],
      product_id: "2"
    },
    {
      id: "2-2",
      material_name: "Natural Dyes",
      eco_score: 7,
      impact_description: "Plant-based coloring agents with lower toxicity",
      carbon_footprint: 0.8,
      water_usage: 60,
      recyclability_rating: 6,
      biodegradability_rating: 8,
      certification_ids: ["cert-4"],
      product_id: "2"
    },
    {
      id: "2-3",
      material_name: "Elastane",
      eco_score: 4,
      impact_description: "Small amount added for shape retention",
      carbon_footprint: 4.5,
      water_usage: 120,
      recyclability_rating: 3,
      biodegradability_rating: 2,
      certification_ids: [],
      product_id: "2"
    }
  ],
  "3": [
    {
      id: "3-1",
      material_name: "Aloe Vera Extract",
      eco_score: 9,
      impact_description: "Naturally soothing plant extract that requires minimal processing",
      carbon_footprint: 0.3,
      water_usage: 40,
      recyclability_rating: 8,
      biodegradability_rating: 10,
      certification_ids: ["cert-1", "cert-4"],
      product_id: "3"
    },
    {
      id: "3-2",
      material_name: "Shea Butter",
      eco_score: 8,
      impact_description: "Natural plant-based moisturizer from the shea tree",
      carbon_footprint: 0.7,
      water_usage: 35,
      recyclability_rating: 8,
      biodegradability_rating: 9,
      certification_ids: ["cert-4"],
      product_id: "3"
    },
    {
      id: "3-3",
      material_name: "Beeswax",
      eco_score: 7,
      impact_description: "Natural wax that provides texture and sealing properties",
      carbon_footprint: 1.1,
      water_usage: 10,
      recyclability_rating: 7,
      biodegradability_rating: 8,
      certification_ids: ["cert-3"],
      product_id: "3"
    }
  ],
  "4": [
    {
      id: "4-1",
      material_name: "Recycled Paper",
      eco_score: 7,
      impact_description: "Post-consumer waste paper pulp that saves trees",
      carbon_footprint: 1.2,
      water_usage: 20,
      recyclability_rating: 9,
      biodegradability_rating: 8,
      certification_ids: ["cert-1", "cert-2"],
      product_id: "4"
    },
    {
      id: "4-2",
      material_name: "Plant-based Lining",
      eco_score: 8,
      impact_description: "PLA (polylactic acid) derived from plants instead of petroleum",
      carbon_footprint: 1.5,
      water_usage: 40,
      recyclability_rating: 6,
      biodegradability_rating: 7,
      certification_ids: ["cert-3"],
      product_id: "4"
    },
    {
      id: "4-3",
      material_name: "Vegetable-based Inks",
      eco_score: 7,
      impact_description: "Non-toxic printing inks made from vegetable oils",
      carbon_footprint: 0.9,
      water_usage: 15,
      recyclability_rating: 5,
      biodegradability_rating: 7,
      certification_ids: ["cert-4"],
      product_id: "4"
    }
  ],
  "5": [
    {
      id: "5-1",
      material_name: "Recycled Aluminum",
      eco_score: 7,
      impact_description: "Durable casing made from post-consumer aluminum",
      carbon_footprint: 3.5,
      water_usage: 70,
      recyclability_rating: 9,
      biodegradability_rating: 1,
      certification_ids: ["cert-2"],
      product_id: "5"
    },
    {
      id: "5-2",
      material_name: "Silicon Solar Panel",
      eco_score: 6,
      impact_description: "Renewable energy technology with medium production impact",
      carbon_footprint: 8.2,
      water_usage: 120,
      recyclability_rating: 5,
      biodegradability_rating: 1,
      certification_ids: [],
      product_id: "5"
    },
    {
      id: "5-3",
      material_name: "Lithium-Ion Battery",
      eco_score: 3,
      impact_description: "Energy storage with significant mining impact",
      carbon_footprint: 12.5,
      water_usage: 200,
      recyclability_rating: 4,
      biodegradability_rating: 0,
      certification_ids: [],
      product_id: "5"
    }
  ]
};

const MaterialAnalysis = ({ productId }: MaterialAnalysisProps) => {
  const isPredefinedProduct = ["1", "2", "3", "4", "5"].includes(productId);
  
  const { data: materials = [], isLoading: materialsLoading, error: materialsError } = useQuery({
    queryKey: ['material-analysis', productId],
    queryFn: async () => {
      if (isPredefinedProduct) {
        console.log(`Using predefined materials for product ${productId}`);
        return predefinedMaterials[productId] || [];
      }
      
      console.log(`Fetching materials for product ${productId} from Supabase`);
      const { data, error } = await supabase
        .from('material_analysis')
        .select('*')
        .eq('product_id', productId);
      
      if (error) throw error;
      return data as MaterialAnalysis[];
    },
  });

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_certifications')
        .select('*');
      
      if (error) throw error;
      return data as Certification[];
    },
  });

  if (materialsLoading || certificationsLoading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>;
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

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-eco-secondary">Materials Analysis</h4>
      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{material.material_name}</span>
                <Badge variant="secondary" className="bg-eco-primary text-white">
                  Eco Score: {material.eco_score}/10
                </Badge>
              </div>
              
              <Progress 
                value={material.eco_score * 10} 
                className="h-2" 
                indicatorClassName="bg-eco-primary"
              />
              
              <p className="text-sm text-gray-600">{material.impact_description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Leaf className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Carbon Footprint</p>
                    <p className="text-xs text-gray-600">{material.carbon_footprint}kg CO2</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Droplets className="text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Water Usage</p>
                    <p className="text-xs text-gray-600">{material.water_usage}L</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Recycle className="text-eco-primary" />
                  <div>
                    <p className="text-sm font-medium">Recyclability</p>
                    <Progress 
                      value={material.recyclability_rating * 10} 
                      className="h-2 mt-1" 
                      indicatorClassName="bg-eco-primary"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Timer className="text-eco-accent" />
                  <div>
                    <p className="text-sm font-medium">Biodegradability</p>
                    <Progress 
                      value={material.biodegradability_rating * 10} 
                      className="h-2 mt-1" 
                      indicatorClassName="bg-eco-accent"
                    />
                  </div>
                </div>
              </div>
              
              {material.certification_ids && material.certification_ids.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {certifications
                      .filter(cert => material.certification_ids.includes(cert.id))
                      .map(cert => (
                        <Badge key={cert.id} variant="outline" className="text-xs">
                          {cert.name} - {cert.issuing_body}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaterialAnalysis;
