
import { supabase } from "@/integrations/supabase/client";

/**
 * Analyzes an image for materials detection using Google Cloud Vision API
 */
export const analyzeImage = async (
  imageData: string, 
  productId: string,
  fileName?: string
): Promise<{
  success: boolean;
  materials?: string[];
  confidence?: number;
  actualProductId?: string;
}> => {
  try {
    console.log("Starting material analysis for image using Google Cloud Vision");
    
    // Extract the base64 data from the data URL
    let base64Image = imageData;
    if (imageData.includes('base64,')) {
      base64Image = imageData.split('base64,')[1];
    }

    // Call the Supabase Edge Function that will use Google Cloud Vision API
    const { data, error } = await supabase.functions.invoke('analyze-materials', {
      body: { 
        image: base64Image,
        productId,
        fileName,
        useVision: true  // Flag to use Google Cloud Vision API
      }
    });
    
    if (error) {
      console.error("Error calling analyze-materials function:", error);
      throw error;
    }
    
    console.log("Analysis response:", data);
    
    // If we have a successful response with materials
    if (data && data.success) {
      // Extract materials from response
      let detectedMaterials: string[] = [];
      
      if (data.materials) {
        // If the API returns detected materials directly
        detectedMaterials = data.materials.map((m: any) => 
          typeof m === 'string' ? m : m.name || m.material || ''
        ).filter(Boolean);
      } else if (data.labelAnnotations) {
        // If we have Google Vision API response format
        detectedMaterials = data.labelAnnotations
          .filter((label: any) => label.score > 0.7)
          .map((label: any) => label.description);
      }
      
      // Remove duplicates
      detectedMaterials = [...new Set(detectedMaterials)];
      
      console.log("Detected materials:", detectedMaterials);
      
      // Get eco score from the response or calculate based on materials
      const ecoScore = data.eco_score || 
                      data.confidence || 
                      (detectedMaterials.some(m => 
                        m.toLowerCase().includes('plastic') || 
                        m.toLowerCase().includes('synthetic')
                      ) ? 3.5 : 7.5);
      
      // Get product type from response or determine from materials
      const actualProductId = data.actualProductId || productId;
      
      // Store scan in database if user is logged in
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { error: dbError } = await supabase
            .from('material_scans')
            .insert({
              product_id: actualProductId,
              scan_data: "vision-api-scan", // Don't store the full image data
              confidence_score: ecoScore,
              detected_materials: detectedMaterials,
              user_id: session.user.id
            });

          if (dbError) {
            console.error("Database error:", dbError);
          }
        }
      } catch (dbErr) {
        console.error("Error saving scan data:", dbErr);
      }

      return {
        success: true,
        materials: detectedMaterials,
        confidence: ecoScore,
        actualProductId
      };
    }
    
    // Default fallback if the API response doesn't have the expected format
    return { 
      success: true,
      materials: ["No materials detected"],
      confidence: 5.0,
      actualProductId: productId
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    return { 
      success: false
    };
  }
};
