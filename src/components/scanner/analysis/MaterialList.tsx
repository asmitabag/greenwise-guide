
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, Recycle, Timer } from "lucide-react";

interface MaterialProps {
  material: {
    id: string;
    name: string;
    percentage: number;
    eco_score: number;
    sustainable: boolean;
    details: string;
    carbon_footprint: number;
    water_usage: number;
    recyclability_rating: number;
    biodegradability_rating: number;
    certification_ids: string[];
  };
  certifications: Array<{
    id: string;
    name: string;
    issuing_body: string;
  }>;
}

const MaterialList = ({ material, certifications }: MaterialProps) => {
  return (
    <Card key={material.id}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{material.name}</span>
            <Badge variant="secondary" className={`${material.eco_score > 7 ? 'bg-green-500' : material.eco_score > 4 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
              Eco Score: {material.eco_score}/10
            </Badge>
          </div>
          
          <Progress 
            value={material.eco_score * 10} 
            className="h-2" 
            indicatorClassName={material.eco_score > 7 ? 'bg-green-500' : material.eco_score > 4 ? 'bg-amber-500' : 'bg-red-500'}
          />
          
          <p className="text-sm text-gray-600">{material.details}</p>
          
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
      </CardContent>
    </Card>
  );
};

export default MaterialList;
