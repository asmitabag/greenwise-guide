
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRef } from 'react';

interface ScannerOptionsProps {
  onStartCamera: () => void;
  onFileSelected: (file: File) => void;
  cameraError: string | null;
  detectedMaterials: string[];
  scanAttempted: boolean;
  onViewResults: () => void;
}

const ScannerOptions = ({ 
  onStartCamera, 
  onFileSelected, 
  cameraError, 
  detectedMaterials,
  scanAttempted,
  onViewResults
}: ScannerOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="bg-eco-muted mx-auto rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
          <Camera className="h-8 w-8 text-eco-primary" />
        </div>
        <h3 className="text-lg font-medium">Material Scanner</h3>
        <p className="text-sm text-gray-500 mt-1">
          Position the product label or packaging in the frame to analyze materials
        </p>
      </div>
      
      {cameraError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{cameraError}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          onClick={onStartCamera}
          className="w-full bg-eco-primary hover:bg-eco-accent"
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera Scan
        </Button>
        
        <Button 
          onClick={openFileUpload}
          variant="outline"
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {scanAttempted && (
        <div className="mt-6 space-y-4">
          {detectedMaterials.length > 0 && (
            <div className="bg-gray-50 p-3 rounded border">
              <h4 className="font-medium text-sm mb-2">Detected Materials:</h4>
              <div className="flex flex-wrap gap-1">
                {detectedMaterials.map((material, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Your last scan was completed. View the results in the Analysis tab.
          </p>
          <Button 
            onClick={onViewResults}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            View Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScannerOptions;
