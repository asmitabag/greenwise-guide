
import { AlertCircle, Leaf } from "lucide-react";

interface AnalysisWarningsProps {
  warnings: string[];
  recommendations: string[];
}

const AnalysisWarnings = ({ warnings, recommendations }: AnalysisWarningsProps) => {
  return (
    <>
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-md font-medium">Environmental Concerns</h3>
          <div className="bg-red-50 border border-red-100 rounded-md p-3">
            <ul className="space-y-2">
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-md font-medium">Sustainability Recommendations</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <Leaf className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AnalysisWarnings;
