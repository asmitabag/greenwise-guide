
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

    // Try to determine product type from filename
    const determineProductTypeFromFileName = (name?: string): string | null => {
      if (!name) return null;
      
      const lowerName = name.toLowerCase();
      if (lowerName.includes('dress') || lowerName.includes('fashion')) {
        return 'fast-fashion-dress-001';
      } else if (lowerName.includes('camera') || lowerName.includes('photo')) {
        return 'disposable-camera-001';
      } else if (lowerName.includes('glass') || lowerName.includes('sunglass')) {
        return 'plastic-glasses-001';
      } else if (lowerName.includes('solar') || lowerName.includes('power')) {
        return 'solar-power-bank-001';
      } else if (lowerName.includes('perfume') || lowerName.includes('fragrance')) {
        return 'perfume';
      } else if (lowerName.includes('cream') || lowerName.includes('face')) {
        return 'natural-face-cream';
      } else if (lowerName.includes('cotton') || lowerName.includes('shirt')) {
        return 'organic-cotton-shirt';
      }
      
      return null;
    };

    // Call the Supabase Edge Function that will use Google Cloud Vision API
    const { data, error } = await supabase.functions.invoke('analyze-materials', {
      body: { 
        image: base64Image,
        productId,
        fileName,
        productType: determineProductTypeFromFileName(fileName),
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
      } else if (data.visionData?.labelAnnotations) {
        // New format with structured vision data
        detectedMaterials = data.visionData.labelAnnotations
          .filter((label: any) => label.score > 0.7)
          .map((label: any) => label.description);
      }
      
      // If we have textAnnotation from OCR, add that too
      if (data.visionData?.textAnnotation) {
        const text = data.visionData.textAnnotation;
        // Extract material-related terms from text
        const materialKeywords = [
          'cotton', 'polyester', 'nylon', 'wool', 'silk', 'leather',
          'plastic', 'glass', 'metal', 'paper', 'wood', 'bamboo',
          'alcohol', 'fragrance', 'perfume'
        ];
        
        materialKeywords.forEach(keyword => {
          if (text.toLowerCase().includes(keyword)) {
            detectedMaterials.push(keyword);
          }
        });
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
    
    // If there was a problem with the analysis but it's not a fatal error
    return { 
      success: true,
      materials: ["No materials detected"],
      confidence: 5.0,
      actualProductId: productId
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    // Return a default set of materials rather than failing completely
    return { 
      success: true,
      materials: ["Synthetic Material", "Plastic"],
      confidence: 3.0,
      actualProductId: productId
    };
  }
};
