
import { Redo } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CapturedImageViewProps {
  imageUrl: string;
  onNewScan: () => void;
  onViewResults: () => void;
  isAnalyzing: boolean;
  scanSuccess: boolean;
  uploadedFileName?: string;
}

const CapturedImageView = ({ 
  imageUrl, 
  onNewScan, 
  onViewResults, 
  isAnalyzing, 
  scanSuccess,
  uploadedFileName
}: CapturedImageViewProps) => {
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black flex justify-center">
        <div className="relative max-h-[50vh] w-full">
          <img 
            src={imageUrl} 
            alt="Captured material scan" 
            className="object-contain w-full h-full max-h-[50vh]"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-eco-primary"></div>
                  <p className="text-sm font-medium">Analyzing materials...</p>
                  <p className="text-xs text-gray-500">This will take a few seconds</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={onNewScan}
          className="flex-1"
          variant="outline"
          disabled={isAnalyzing}
        >
          <Redo className="w-4 h-4 mr-2" />
          New Scan
        </Button>
        {scanSuccess && (
          <Button 
            onClick={onViewResults}
            variant="default"
            className="bg-eco-primary hover:bg-eco-accent flex-1"
          >
            View Results
          </Button>
        )}
      </div>
      
      {uploadedFileName && !isAnalyzing && !scanSuccess && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-500">
            Analyzing {uploadedFileName}... This may take a moment.
          </p>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700 text-center">
            Analyzing materials... This will complete in a few seconds.
          </p>
          <div className="mt-2">
            <Skeleton className="h-2 w-full bg-blue-200" />
          </div>
        </div>
      )}
      
      {scanSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-700 text-center">
            Analysis complete! Click "View Results" to see the detailed breakdown.
          </p>
        </div>
      )}
    </div>
  );
};

export default CapturedImageView;
