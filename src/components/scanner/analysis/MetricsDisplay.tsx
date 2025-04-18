
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Recycle } from "lucide-react";

interface MetricsDisplayProps {
  ecoScore: number;
  metrics: {
    biodegradable_percentage: number;
    water_saved: number;
    energy_efficiency: number;
  };
}

const MetricsDisplay = ({ ecoScore, metrics }: MetricsDisplayProps) => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-md font-medium">Sustainability Score</h3>
        <Progress 
          value={ecoScore * 10} 
          className="h-2.5" 
          indicatorClassName={`${ecoScore > 7 ? 'bg-green-500' : ecoScore > 4 ? 'bg-amber-500' : 'bg-red-500'}`} 
        />
        <p className="text-sm text-gray-600">
          This product has {ecoScore > 7 ? 'good' : ecoScore > 4 ? 'moderate' : 'poor'} sustainability metrics
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-3 rounded-md text-center">
          <Leaf className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Biodegradable</p>
          <p className="text-lg font-bold text-green-600">{metrics.biodegradable_percentage}%</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md text-center">
          <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Water Saved</p>
          <p className="text-lg font-bold text-blue-600">{metrics.water_saved}ml</p>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-md text-center">
          <Recycle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Energy Efficient</p>
          <p className="text-lg font-bold text-amber-600">{metrics.energy_efficiency}%</p>
        </div>
      </div>
    </>
  );
};

export default MetricsDisplay;
