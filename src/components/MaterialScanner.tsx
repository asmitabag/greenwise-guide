
import { useState, useRef, useEffect } from 'react';
import { Camera, Aperture, AlertCircle, Upload, Redo } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface MaterialScannerProps {
  productId: string;
  onScanComplete: (productId?: string) => void;
}

const MaterialScanner = ({ productId, onScanComplete }: MaterialScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Cleanup camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      setCameraError(null);
      setIsAnalyzing(false);
      setScanSuccess(false);
      
      if (streamRef.current) {
        // Stop any existing stream
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Try to access the environment/back camera on mobile
      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      console.log("Requesting camera with constraints:", JSON.stringify(constraints));
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsScanning(true);
          setCapturedImage(null);
          setUploadedFile(null);
          
          // Play the video once loaded
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => {
                console.error("Error playing video:", e);
                setCameraError("Failed to play video stream. Please try again.");
              });
            }
          };
          
          console.log("Camera stream acquired successfully");
        }
      } catch (mobileError) {
        console.error("Initial camera access error:", mobileError);
        
        // Fallback to any available camera
        console.log("Falling back to any camera");
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            streamRef.current = fallbackStream;
            setIsScanning(true);
            setCapturedImage(null);
            setUploadedFile(null);
            
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => {
                  console.error("Error playing fallback video:", e);
                  setCameraError("Failed to play video stream. Please try again.");
                });
              }
            };
            
            console.log("Fallback camera stream acquired successfully");
          }
        } catch (fallbackError) {
          console.error("Fallback camera access error:", fallbackError);
          setCameraError("Unable to access camera. Please check camera permissions.");
          toast({
            title: "Camera Access Failed",
            description: "Unable to access camera. Please check camera permissions.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("General camera error:", error);
      setCameraError("Unable to access camera. Please check permissions.");
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const captureImage = () => {
    if (!videoRef.current) {
      console.error("Video reference is null");
      return null;
    }

    try {
      // Create canvas if it doesn't exist
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log("Capturing image with dimensions:", canvas.width, "x", canvas.height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Draw the current video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      console.log("Image captured successfully");
      
      return imageData;
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Capture Failed",
        description: "Failed to capture image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const analyzeImage = async (imageData: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to scan materials",
          variant: "destructive",
        });
        return false;
      }

      setIsAnalyzing(true);
      
      console.log("Sending image to analyze-materials function");
      const { data: scanResult, error: functionError } = await supabase.functions.invoke('analyze-materials', {
        body: { 
          image: imageData,
          productId: productId
        }
      });

      if (functionError) {
        console.error("Function error:", functionError);
        throw functionError;
      }

      console.log("Scan result:", scanResult);
      
      if (!scanResult.success) {
        throw new Error("Analysis failed");
      }

      const { error: dbError } = await supabase
        .from('material_scans')
        .insert({
          product_id: productId,
          scan_data: imageData,
          confidence_score: scanResult?.confidence || 0.8,
          detected_materials: scanResult?.materials?.map(m => m.name) || ["cotton", "polyester"],
          user_id: session.user.id
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      toast({
        title: "Scan Complete",
        description: "Materials analysis has been updated.",
      });
      
      setScanSuccess(true);
      setIsAnalyzing(false);
      return true;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze materials. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      return false;
    }
  };

  const captureAndAnalyze = async () => {
    // Stop camera after capturing
    const imageData = captureImage();
    if (!imageData) return;
    
    setCapturedImage(imageData);
    stopCamera();
    
    // Analyze the captured image
    await analyzeImage(imageData);
  };

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);
    setUploadedFile(file);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        console.log("File converted to base64");
        setCapturedImage(imageData);
        await analyzeImage(imageData);
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
  };

  const viewResults = () => {
    onScanComplete(productId);
  };

  return (
    <Card className="p-4 shadow-md">
      <div className="space-y-4">
        {!isScanning && !capturedImage ? (
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
                onClick={startCamera}
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
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black flex justify-center">
              {capturedImage ? (
                <div className="relative max-h-[50vh] w-full">
                  <img 
                    src={capturedImage} 
                    alt="Captured material scan" 
                    className="object-contain w-full h-full max-h-[50vh]"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <div className="bg-white p-3 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-eco-primary"></div>
                          <p className="text-sm font-medium">Analyzing materials...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[50vh] object-cover"
                />
              )}
            </div>
            
            <div className="flex gap-2">
              {!capturedImage ? (
                <>
                  <Button 
                    onClick={captureAndAnalyze}
                    className="flex-1 bg-eco-primary hover:bg-eco-accent"
                    disabled={isAnalyzing}
                  >
                    <Aperture className="w-4 h-4 mr-2" />
                    Capture & Analyze
                  </Button>
                  <Button 
                    onClick={stopCamera}
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleNewScan}
                    className="flex-1"
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    <Redo className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                  {scanSuccess && (
                    <Button 
                      onClick={viewResults}
                      variant="default"
                      className="bg-eco-primary"
                    >
                      View Results
                    </Button>
                  )}
                </>
              )}
            </div>
            
            {uploadedFile && !isAnalyzing && !scanSuccess && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">
                  Analyzing {uploadedFile.name}... This may take a moment.
                </p>
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
        )}
      </div>
    </Card>
  );
};

export default MaterialScanner;
