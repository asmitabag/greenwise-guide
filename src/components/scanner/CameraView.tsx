
import { useState, useRef, useEffect } from 'react';
import { Aperture, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { startCameraStream, captureImageFromVideo } from './utils/camera-utils';
import { useIsMobile } from "@/hooks/use-mobile";

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  cameraInitialized: boolean;
  setCameraInitialized: (initialized: boolean) => void;
}

const CameraView = ({ 
  onCapture, 
  onCancel, 
  cameraInitialized, 
  setCameraInitialized 
}: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewFinderActive, setViewFinderActive] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await startCameraStream(videoRef.current, isMobile);
        
        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                console.log("Camera stream is now playing");
                setViewFinderActive(true);
                setCameraInitialized(true);
              }).catch(e => {
                console.error("Error playing video:", e);
              });
            }
          };
        }
      } catch (error) {
        console.error("Camera initialization error:", error);
      }
    };

    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMobile, setCameraInitialized]);

  const handleCapture = () => {
    const imageData = captureImageFromVideo(videoRef.current, canvasRef);
    if (imageData) {
      onCapture(imageData);
    }
  };

  return (
    <DialogContent className="sm:max-w-md p-0 overflow-hidden">
      <DialogHeader className="p-4 border-b">
        <DialogTitle>Take a Photo</DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Position the product label or ingredients list in the frame
        </DialogDescription>
        <DialogClose onClick={onCancel} className="absolute right-4 top-4" />
      </DialogHeader>
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: cameraInitialized ? 'block' : 'none' }}
        />
        {!cameraInitialized && (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">Camera initializing...</p>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center p-4">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCapture}
          disabled={!cameraInitialized || !viewFinderActive}
          className="bg-eco-primary hover:bg-eco-accent"
        >
          Capture
        </Button>
      </div>
    </DialogContent>
  );
};

export default CameraView;
