
import { useState, useRef, useCallback } from 'react';
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
        {!isScanning ? (
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
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={captureAndAnalyze}
                className="flex-1 bg-eco-primary hover:bg-eco-accent"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Materials"}
              </Button>
              <Button 
                onClick={stopCamera}
                variant="outline"
                disabled={isAnalyzing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MaterialScanner;
