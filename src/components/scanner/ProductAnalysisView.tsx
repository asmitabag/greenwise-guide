
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialAnalysis from "@/components/MaterialAnalysis";

interface ProductAnalysisViewProps {
  productId: string;
  onBack: () => void;
}

const ProductAnalysisView = ({ productId, onBack }: ProductAnalysisViewProps) => {
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Material Analysis</CardTitle>
        <CardDescription>Detailed breakdown of materials and their environmental impact</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <MaterialAnalysis productId={productId} />
      </CardContent>
      <CardFooter className="pt-4 px-0 pb-0">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back to History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductAnalysisView;
