
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced material analysis with OCR-based ingredient detection
function analyzeMaterials(imageData: string, fileName?: string) {
  console.log("Analyzing materials from image data of length:", imageData.length);
  console.log("File name if available:", fileName);
  
  // In a real implementation, this would use computer vision to detect materials
  // For this demo, we'll simulate detection based on image data characteristics
  
  // Detect ingredients from the image data (simulated)
  // In a real implementation, this would use OCR and image analysis
  const hasTextSignature = imageData.length > 10000 && imageData.length < 500000;
  const isLargeImage = imageData.length > 500000;
  const isSmallImage = imageData.length < 10000;
  
  // Different material types based on image characteristics
  let materials = [];
  let ecoScore = 0;
  let warnings = [];
  
  if (fileName?.toLowerCase().includes("plastic") || (isLargeImage && !hasTextSignature)) {
    // Plastic product analysis
    materials = [
      { name: "PET Plastic", percentage: 85, eco_score: 4, sustainable: false, 
        details: "Petroleum-derived plastic with high environmental impact" },
      { name: "Colorants", percentage: 10, eco_score: 3, sustainable: false, 
        details: "Chemical dyes with potential toxicity issues" },
      { name: "Stabilizers", percentage: 5, eco_score: 5, sustainable: false, 
        details: "Chemical additives to improve durability" }
    ];
    
    warnings = [
      "Contains petroleum-derived plastics",
      "Low recyclability in many regions",
      "Contributes to microplastic pollution"
    ];
    
    ecoScore = 3.9;
  } 
  else if (fileName?.toLowerCase().includes("paper") || (hasTextSignature && !isLargeImage)) {
    // Paper product analysis
    materials = [
      { name: "Recycled Paper", percentage: 70, eco_score: 8, sustainable: true, 
        details: "Post-consumer recycled paper fiber" },
      { name: "Virgin Pulp", percentage: 20, eco_score: 5, sustainable: false, 
        details: "Newly harvested wood pulp" },
      { name: "Binding Agents", percentage: 10, eco_score: 6, sustainable: true, 
        details: "Natural starch-based adhesives" }
    ];
    
    warnings = [
      "Contains some virgin wood pulp",
      "Moderate water usage in production",
      "Consider fully recycled alternatives"
    ];
    
    ecoScore = 7.1;
  }
  else if (fileName?.toLowerCase().includes("textile") || fileName?.toLowerCase().includes("fabric")) {
    // Textile analysis
    materials = [
      { name: "Cotton", percentage: 60, eco_score: 6, sustainable: false, 
        details: "Conventional cotton with high water usage" },
      { name: "Polyester", percentage: 40, eco_score: 4, sustainable: false, 
        details: "Synthetic material derived from petroleum" }
    ];
    
    warnings = [
      "Cotton production uses significant water resources",
      "Polyester content is not biodegradable", 
      "Consider organic or recycled alternatives"
    ];
    
    ecoScore = 5.2;
  }
  else if (fileName?.toLowerCase().includes("food") || fileName?.toLowerCase().includes("package")) {
    // Food packaging analysis
    materials = [
      { name: "Paperboard", percentage: 75, eco_score: 7, sustainable: true, 
        details: "Recyclable paperboard from managed forests" },
      { name: "Plastic Film", percentage: 20, eco_score: 3, sustainable: false, 
        details: "Thin plastic layer for moisture protection" },
      { name: "Aluminum", percentage: 5, eco_score: 5, sustainable: true, 
        details: "Thin aluminum layer for preservation" }
    ];
    
    warnings = [
      "Multi-material packaging is difficult to recycle",
      "Contains plastic film layer",
      "Check local recycling guidelines before disposal"
    ];
    
    ecoScore = 5.9;
  }
  else {
    // Generic analysis
    materials = [
      { name: "Unidentified Materials", percentage: 100, eco_score: 5, sustainable: false, 
        details: "Could not clearly identify materials from the image. For accurate analysis, please try a clearer image or select the material type when uploading." }
    ];
    
    warnings = [
      "Material identification uncertainty",
      "Consider providing additional information about the product",
      "For better results, try a clearer image"
    ];
    
    ecoScore = 5.0;
  }
  
  // Add water and energy metrics
  const waterSaved = Math.floor(materials.reduce((sum, m) => sum + (m.sustainable ? 200 : 0), 300));
  const energyEfficiency = Math.floor(materials.reduce((sum, m) => sum + (m.eco_score * 3), 10));
  
  // Generate specific recommendations based on materials
  const recommendations = materials.filter(m => !m.sustainable).map(m => 
    `Consider alternatives to ${m.name} with higher sustainability ratings`
  );
  
  // Add general recommendations if needed
  if (recommendations.length < 3) {
    recommendations.push(
      "Look for products with sustainability certifications",
      "Check for recycled or biodegradable alternatives",
      "Research the brand's environmental commitments"
    );
  }
  
  return {
    materials: materials,
    confidence: 0.85,
    eco_score: ecoScore,
    warnings: warnings,
    metrics: {
      water_saved: waterSaved,
      energy_efficiency: energyEfficiency,
      biodegradable_percentage: materials.filter(i => i.sustainable).reduce((sum, i) => sum + i.percentage, 0)
    },
    recommendations: recommendations.slice(0, 3),
    success: true
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to analyze materials");
    
    // Get request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body - could not parse JSON', success: false }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { image, productId, fileName } = requestBody;

    if (!image || !productId) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: 'Image and productId are required', success: false }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Analyze materials in the image
    console.log(`Processing image for product ID: ${productId}`);
    const result = analyzeMaterials(image, fileName);
    console.log("Analysis complete:", result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      },
    );
  }
});
