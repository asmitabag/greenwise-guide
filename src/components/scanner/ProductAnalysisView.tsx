
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialAnalysis from "@/components/MaterialAnalysis";
import { ArrowLeft } from "lucide-react";

interface ProductAnalysisViewProps {
  productId: string;
  onBack: () => void;
}

const ProductAnalysisView = ({ productId, onBack }: ProductAnalysisViewProps) => {
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Material Analysis</CardTitle>
            <CardDescription>Detailed breakdown of materials and their environmental impact</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <MaterialAnalysis productId={productId} />
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
