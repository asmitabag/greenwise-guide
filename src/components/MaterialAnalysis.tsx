
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface MaterialAnalysisProps {
  productId: string;
}

interface MaterialAnalysis {
  id: string;
  material_name: string;
  eco_score: number;
  impact_description: string;
}

const MaterialAnalysis = ({ productId }: MaterialAnalysisProps) => {
  const { data: materials = [], isLoading } = useQuery({
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

  if (isLoading) {
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{material.material_name}</span>
                <span className="text-sm text-gray-600">
                  Eco Score: {material.eco_score}/10
                </span>
              </div>
              <Progress value={material.eco_score * 10} className="h-2" />
              <p className="text-sm text-gray-600">{material.impact_description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaterialAnalysis;
