
import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsAnalyzing(false);
      
      // First try to access the environment/back camera on mobile
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      console.log("Requesting camera with constraints:", constraints);
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsScanning(true);
          setCapturedImage(null);
          
          // Ensure the video is set to play once loaded
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            videoRef.current?.play().catch(e => {
              console.error("Error playing video:", e);
              setCameraError("Failed to play video stream. Please try again.");
            });
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
            
            videoRef.current.onloadedmetadata = () => {
              console.log("Fallback video metadata loaded");
              videoRef.current?.play().catch(e => {
                console.error("Error playing fallback video:", e);
                setCameraError("Failed to play video stream. Please try again.");
              });
            };
            
            console.log("Fallback camera stream acquired successfully");
          }
        } catch (fallbackError) {
          console.error("Fallback camera access error:", fallbackError);
          setCameraError("Unable to access any camera. Please check your camera permissions and try again.");
          toast({
            title: "Camera Access Failed",
            description: "Unable to access any camera. Please check camera permissions in your browser settings.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("General camera access error:", error);
      setCameraError("Unable to access camera. Please ensure you've granted camera permissions.");
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure you've granted camera permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = useCallback(() => {
    console.log("Stopping camera");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const captureAndAnalyze = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to scan materials",
        variant: "destructive",
      });
      return;
    }

    if (!videoRef.current) {
      console.error("Video reference is null");
      return;
    }

    setIsAnalyzing(true);

    try {
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvasRef.current = canvas;
      }
      
      // Make sure we set canvas dimensions based on the video
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      
      console.log("Capturing frame, video dimensions:", videoWidth, "x", videoHeight);
      
      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error("Video stream dimensions are not available");
      }
      
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      
      // Save the captured image for preview
      setCapturedImage(imageData);
      console.log("Image captured successfully");
      
      // Stop the camera after capture
      stopCamera();
      
      // Simulate loading for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));

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

      const { error: dbError } = await supabase
        .from('material_scans')
        .insert({
          product_id: productId,
          scan_data: imageData,
          confidence_score: scanResult?.confidence || 0.8,
          detected_materials: scanResult?.materials || ["cotton", "polyester"],
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

      setIsAnalyzing(false);
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to analyze materials. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
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

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to scan materials",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        console.log("File converted to base64, length:", imageData.length);
        setCapturedImage(imageData);
        
        // Simulate loading for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Sending uploaded image to analyze-materials function");
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

        console.log("Scan result from uploaded image:", scanResult);

        const { error: dbError } = await supabase
          .from('material_scans')
          .insert({
            product_id: productId,
            scan_data: imageData,
            confidence_score: scanResult?.confidence || 0.8,
            detected_materials: scanResult?.materials || ["cotton", "polyester"],
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
        
        setIsAnalyzing(false);
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        throw new Error("Error reading file");
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to analyze materials. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setCapturedImage(null);
    setIsScanning(false);
    setIsAnalyzing(false);
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
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured material scan" 
                    className="max-h-[50vh] rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-lg shadow-lg">
                      <div className="flex items-center gap-2">
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-eco-primary"></div>
                            <p className="text-sm font-medium">Analyzing materials...</p>
                          </>
                        ) : (
                          <p className="text-sm font-medium">Scan captured</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-[50vh] rounded-lg"
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
                  <Button 
                    onClick={() => onScanComplete(productId)}
                    variant={isAnalyzing ? "outline" : "default"}
                    disabled={isAnalyzing}
                    className={isAnalyzing ? "" : "bg-eco-primary"}
                  >
                    {isAnalyzing ? "Processing..." : "View Results"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MaterialScanner;
