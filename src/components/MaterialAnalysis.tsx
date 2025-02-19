
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Recycle, Timer, Leaf } from "lucide-react";

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
}

interface Certification {
  id: string;
  name: string;
  issuing_body: string;
  description: string;
}

const MaterialAnalysis = ({ productId }: MaterialAnalysisProps) => {
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['material-analysis', productId],
    queryFn: async () => {
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

  if (!materials.length) {
    return null;
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
              
              <Progress value={material.eco_score * 10} className="h-2" />
              
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
                    <Progress value={material.recyclability_rating * 10} className="h-2 mt-1" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Timer className="text-eco-accent" />
                  <div>
                    <p className="text-sm font-medium">Biodegradability</p>
                    <Progress value={material.biodegradability_rating * 10} className="h-2 mt-1" />
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
