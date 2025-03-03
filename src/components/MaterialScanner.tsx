
import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MaterialScannerProps {
  productId: string;
  onScanComplete: () => void;
}

const MaterialScanner = ({ productId, onScanComplete }: MaterialScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsScanning(true);
      // Reset captured image when starting a new scan
      setCapturedImage(null);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure you've granted camera permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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

    if (!videoRef.current) return;

    setIsAnalyzing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Save the captured image for preview
      setCapturedImage(imageData);

      const { data: scanResult, error: functionError } = await supabase.functions.invoke('analyze-materials', {
        body: { 
          image: imageData,
          productId: productId
        }
      });

      if (functionError) throw functionError;

      const { error: dbError } = await supabase
        .from('material_scans')
        .insert({
          product_id: productId,
          scan_data: imageData,
          confidence_score: scanResult.confidence,
          detected_materials: scanResult.materials,
          user_id: session.user.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Scan Complete",
        description: "Materials analysis has been updated.",
      });

      stopCamera();
      onScanComplete();
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to analyze materials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {!isScanning && !capturedImage ? (
          <Button 
            onClick={startCamera}
            className="w-full bg-eco-primary hover:bg-eco-accent"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Material Scan
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              {capturedImage ? (
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured material scan" 
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-lg shadow-lg">
                      <p className="text-sm font-medium">
                        {isAnalyzing ? "Analyzing materials..." : "Scan captured"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
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
                    {isAnalyzing ? "Analyzing..." : "Capture & Analyze"}
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
                    onClick={startCamera}
                    className="flex-1"
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    New Scan
                  </Button>
                  <Button 
                    onClick={onScanComplete}
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    Done
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
