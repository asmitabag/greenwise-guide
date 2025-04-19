
import { supabase } from "@/integrations/supabase/client";

/**
 * Analyzes an image for materials detection
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
    console.log("Starting material analysis for image");
    
    // Extract text from the image to identify materials
    // In a real app, this would use OCR/ML services
    // For demo, we'll extract materials based on the file name or directly from session storage
    
    // Try to identify materials directly from the image data
    // For this demo, we'll extract materials by checking for common materials in the filename
    let detectedMaterials: string[] = [];
    
    // Check if there's an uploaded image
    if (fileName) {
      const lowerFileName = fileName.toLowerCase();
      
      // Extract detected materials from the filename
      if (lowerFileName.includes('plastic')) detectedMaterials.push('plastic', 'polymer', 'synthetic material');
      if (lowerFileName.includes('glass')) detectedMaterials.push('glass');
      if (lowerFileName.includes('paper')) detectedMaterials.push('paper', 'cardboard');
      if (lowerFileName.includes('metal')) detectedMaterials.push('metal', 'aluminum');
      if (lowerFileName.includes('wood')) detectedMaterials.push('wood');
      if (lowerFileName.includes('fabric')) detectedMaterials.push('fabric', 'cotton');
      if (lowerFileName.includes('ceramic')) detectedMaterials.push('ceramic');
      if (lowerFileName.includes('leather')) detectedMaterials.push('leather');
      
      // Detect specific materials
      if (lowerFileName.includes('cotton')) detectedMaterials.push('cotton');
      if (lowerFileName.includes('polyester')) detectedMaterials.push('polyester');
      if (lowerFileName.includes('nylon')) detectedMaterials.push('nylon');
      if (lowerFileName.includes('aluminum') || lowerFileName.includes('aluminium')) detectedMaterials.push('aluminum');
      if (lowerFileName.includes('steel')) detectedMaterials.push('steel');
      if (lowerFileName.includes('bamboo')) detectedMaterials.push('bamboo');
      
      // Specific to cosmetics and perfumes
      if (lowerFileName.includes('alcohol')) detectedMaterials.push('alcohol');
      if (lowerFileName.includes('fragrance')) detectedMaterials.push('fragrance compounds');
      if (lowerFileName.includes('perfume')) detectedMaterials.push('alcohol', 'fragrance compounds');
      
      // If it's an image of ingredients list
      if (lowerFileName.includes('ingredients') || 
          lowerFileName.includes('composition') || 
          lowerFileName.includes('label')) {
        // For demonstration - this would be an AI/OCR in a real app
        if (lowerFileName.includes('perfume')) {
          detectedMaterials = ['alcohol', 'fragrance compounds', 'water', 'linalool'];
        } else if (detectedMaterials.length === 0) {
          // Check for presence of "bottle" or "container" to identify packaging
          if (lowerFileName.includes('bottle')) {
            detectedMaterials.push('glass');
          }
        }
      }
    }
    
    // For demo purposes - handle image data for known image types
    // This would normally be an AI-based image recognition step
    if (detectedMaterials.length === 0 && imageData) {
      // If the image data contains a PNG signature and no materials detected yet
      if (imageData.includes('data:image/png;base64,')) {
        // This is a placeholder for AI-based material detection
        detectedMaterials = ['plastic', 'polymer', 'synthetic material'];
        console.log("Detected plastic materials from PNG image");
      }
      
      // For JPG images
      if (imageData.includes('data:image/jpeg;base64,')) {
        // This is a placeholder for AI-based material detection
        if (imageData.length > 50000) { // Large image might be more detailed
          detectedMaterials = ['plastic', 'polymer', 'synthetic material'];
        } else {
          detectedMaterials = ['plastic', 'polymer'];
        }
        console.log("Detected materials from JPEG image");
      }
    }
    
    // Default case: if no materials detected from filename and image analysis
    if (detectedMaterials.length === 0) {
      // This would use AI/ML for actual material detection
      // For demo, use generic materials based on the product ID
      if (productId === "1" || productId.includes("bamboo")) {
        detectedMaterials = ["bamboo", "stainless steel", "silicone"];
      } else if (productId === "2" || productId.includes("cotton")) {
        detectedMaterials = ["organic cotton", "natural dyes", "elastane"];
      } else if (productId === "3" || productId.includes("cream")) {
        detectedMaterials = ["aloe vera", "shea butter", "coconut oil"];
      } else if (productId === "4" || productId.includes("coffee")) {
        detectedMaterials = ["recycled paper", "plant-based lining", "vegetable inks"];
      } else if (productId === "5" || productId.includes("solar")) {
        detectedMaterials = ["recycled aluminum", "silicon", "lithium-ion"];
      } else {
        // Default fallback
        detectedMaterials = ["plastic", "synthetic polymers", "mixed materials"];
      }
      console.log("Using default materials based on product ID:", productId);
    }
    
    // Store unique materials only
    detectedMaterials = [...new Set(detectedMaterials)];
    
    console.log("Detected materials:", detectedMaterials);
    
    // Determine the actual product type from the materials
    let actualProductId = productId;
    let ecoScore = 0.65; // Default medium eco score
    
    // Determine eco-score based on detected materials
    // Higher score for natural/sustainable materials, lower for synthetics
    const sustainableMaterials = ['bamboo', 'organic cotton', 'recycled paper', 'glass', 'natural dyes', 'aloe vera', 'plant-based'];
    const unsustainableMaterials = ['plastic', 'synthetic', 'nylon', 'polyester', 'lithium-ion'];
    
    // Count sustainable vs unsustainable materials
    const sustainableCount = detectedMaterials.filter(m => 
      sustainableMaterials.some(sm => m.toLowerCase().includes(sm.toLowerCase()))).length;
    
    const unsustainableCount = detectedMaterials.filter(m => 
      unsustainableMaterials.some(um => m.toLowerCase().includes(um.toLowerCase()))).length;
    
    // Calculate score based on ratio (0.3-0.9 range)
    const totalMaterials = Math.max(1, sustainableCount + unsustainableCount);
    ecoScore = 0.3 + (0.6 * (sustainableCount / totalMaterials));
    ecoScore = Math.min(0.95, Math.max(0.2, ecoScore)); // Clamp between 0.2-0.95
    
    // Determine best product type based on materials
    if (detectedMaterials.some(m => m.toLowerCase().includes('plastic'))) {
      // For plastic, use perfume as a default template since it has plastic packaging
      actualProductId = "perfume";
    } else if (detectedMaterials.some(m => m.toLowerCase().includes('bamboo'))) {
      actualProductId = "1";
    } else if (detectedMaterials.some(m => m.toLowerCase().includes('cotton'))) {
      actualProductId = "2";
    } else if (detectedMaterials.some(m => m.toLowerCase().includes('aloe'))) {
      actualProductId = "3";
    } else if (detectedMaterials.some(m => m.toLowerCase().includes('paper'))) {
      actualProductId = "4";
    } else if (detectedMaterials.some(m => m.toLowerCase().includes('solar'))) {
      actualProductId = "5";
    }
    
    // Try to store scan in database if user is logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { error: dbError } = await supabase
          .from('material_scans')
          .insert({
            product_id: actualProductId,
            scan_data: imageData.substring(0, 100) + "...",
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
  } catch (error) {
    console.error('Analysis error:', error);
    return { 
      success: false
    };
  }
};
