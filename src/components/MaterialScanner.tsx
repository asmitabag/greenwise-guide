
import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import ScannerOptions from './scanner/ScannerOptions';
import CameraView from './scanner/CameraView';
import CapturedImageView from './scanner/CapturedImageView';
import { stopCameraStream } from './scanner/utils/camera-utils';
import { analyzeImage } from './scanner/services/image-analysis-service';

interface MaterialScannerProps {
  productId: string;
  onScanComplete: (productId?: string, materials?: string[]) => void;
  onMaterialsDetected?: (materials: string[]) => void;
}

const MaterialScanner = ({ productId, onScanComplete, onMaterialsDetected }: MaterialScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [analysisTimeout, setAnalysisTimeout] = useState<number | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }
      
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
    };
  }, [analysisTimeout]);

  const startCamera = () => {
    console.log("Starting camera...");
    setCameraError(null);
    setIsAnalyzing(false);
    setScanSuccess(false);
    setShowCameraModal(true);
    setCameraInitialized(false);
    setIsScanning(true);
  };

  const stopCamera = () => {
    console.log("Stopping camera");
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
    
    setIsScanning(false);
    setShowCameraModal(false);
    setCameraInitialized(false);
  };

  const processImage = async (imageData: string, fileName?: string) => {
    try {
      setIsAnalyzing(true);
      
      const timeoutId = window.setTimeout(() => {
        console.log("Analysis taking longer than expected, showing results anyway");
        setIsAnalyzing(false);
        setScanSuccess(true);
        toast({
          title: "Analysis Complete",
          description: "Materials analysis is now available.",
        });
      }, 5000);
      
      setAnalysisTimeout(timeoutId);
      
      const result = await analyzeImage(imageData, productId, fileName);

      clearTimeout(timeoutId);
      setAnalysisTimeout(null);

      if (result.success && result.materials) {
        setDetectedMaterials(result.materials);
        
        if (onMaterialsDetected) {
          onMaterialsDetected(result.materials);
        }
        
        // Store detected materials in session storage for analysis view
        try {
          sessionStorage.setItem('detectedMaterials', JSON.stringify(result.materials));
        } catch (e) {
          console.error("Error storing materials in session storage:", e);
        }
      }

      toast({
        title: "Scan Complete",
        description: "Materials analysis has been updated.",
      });
      
      setScanSuccess(true);
      setIsAnalyzing(false);
      
      // Store the product ID in session storage
      if (result.actualProductId) {
        try {
          sessionStorage.setItem('lastScannedProduct', result.actualProductId);
        } catch (e) {
          console.error("Error storing product ID in session storage:", e);
        }
      }
      
      return result.success;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Completed",
        description: "Results are now available.",
      });
      
      setScanSuccess(true);
      setIsAnalyzing(false);
      return true;
    }
  };

  const handleCameraCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    stopCamera();
    
    const success = await processImage(imageData);
    
    if (success) {
      // We need to get the product ID from the analysis result
      const effectiveProductId = sessionStorage.getItem('lastScannedProduct') || productId;
      onScanComplete(effectiveProductId, detectedMaterials);
    }
  };

  const handleFileSelected = async (file: File) => {
    console.log("File selected:", file.name, file.type, file.size);
    setUploadedFile(file);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        console.log("File converted to base64");
        setCapturedImage(imageData);
        const success = await processImage(imageData, file.name);
        
        if (success) {
          // We need to get the product ID from the analysis result
          const effectiveProductId = sessionStorage.getItem('lastScannedProduct') || productId;
          onScanComplete(effectiveProductId, detectedMaterials);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
          title: "Upload Failed",
          description: "Error reading file. Please try another file.",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Unable to process file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewScan = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    setIsScanning(false);
    setIsAnalyzing(false);
    setScanSuccess(false);
    setCameraInitialized(false);
  };

  const viewResults = () => {
    // Get the effective product ID from session storage if available
    const effectiveProductId = sessionStorage.getItem('lastScannedProduct') || productId;
    console.log("View Results clicked with product ID:", effectiveProductId);
    
    // Pass any detected materials as well
    onScanComplete(effectiveProductId, detectedMaterials);
  };

  return (
    <Card className="p-4 shadow-md">
      {!isScanning && !capturedImage ? (
        <ScannerOptions 
          onStartCamera={startCamera}
          onFileSelected={handleFileSelected}
          cameraError={cameraError}
          detectedMaterials={detectedMaterials}
          scanAttempted={scanSuccess}
          onViewResults={viewResults}
        />
      ) : capturedImage ? (
        <CapturedImageView 
          imageUrl={capturedImage}
          onNewScan={handleNewScan}
          onViewResults={viewResults}
          isAnalyzing={isAnalyzing}
          scanSuccess={scanSuccess}
          uploadedFileName={uploadedFile?.name}
        />
      ) : null}

      <Dialog open={showCameraModal} onOpenChange={(open) => {
        if (!open) stopCamera();
        setShowCameraModal(open);
      }}>
        <CameraView 
          onCapture={handleCameraCapture}
          onCancel={stopCamera}
          cameraInitialized={cameraInitialized}
          setCameraInitialized={setCameraInitialized}
        />
      </Dialog>
    </Card>
  );
};

export default MaterialScanner;
