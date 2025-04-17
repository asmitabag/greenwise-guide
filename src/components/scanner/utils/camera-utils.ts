
/**
 * Utility functions for camera operations in the scanner
 */

export const startCameraStream = async (
  videoElement: HTMLVideoElement | null,
  isMobile: boolean
): Promise<MediaStream | null> => {
  if (!videoElement) {
    console.error("No video element provided");
    return null;
  }

  try {
    // Try to get the camera with preferred settings
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
      return stream;
    } catch (mobileError) {
      console.error("Initial camera access error:", mobileError);
      
      // Fallback to any camera
      console.log("Falling back to any camera");
      const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      return fallbackStream;
    }
  } catch (error) {
    console.error("General camera error:", error);
    return null;
  }
};

export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const captureImageFromVideo = (
  videoElement: HTMLVideoElement | null,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
): string | null => {
  if (!videoElement) {
    console.error("Video reference is null");
    return null;
  }

  try {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    const video = videoElement;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    console.log("Capturing image with dimensions:", canvas.width, "x", canvas.height);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log("Image captured successfully");
    
    return imageData;
  } catch (error) {
    console.error("Error capturing image:", error);
    return null;
  }
};
