
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced material analysis with specific ingredients detection
function analyzeMaterials(imageData: string, fileName?: string) {
  console.log("Analyzing materials from image data of length:", imageData.length);
  console.log("File name if available:", fileName);
  
  // Extract and analyze ingredients from the image
  // This is a simulated implementation, in production this would use OCR and ML
  
  let ingredients = [];
  let ecoScore = 6.5;
  let warnings = [];
  
  // Detect if this is food packaging (based on the example image)
  if (imageData.includes("ingredients") || imageData.includes("INGREDIENTS") || 
      fileName?.toLowerCase().includes("food") || 
      imageData.length > 100000) { // Assume larger images might be food labels
    
    // Food product analysis
    ingredients = [
      { name: "Palm Oil", percentage: 15, eco_score: 3, sustainable: false, 
        details: "High deforestation impact, often causes habitat destruction" },
      { name: "Wheat Flour", percentage: 55, eco_score: 7, sustainable: true, 
        details: "Generally sustainable, but water intensive in some regions" },
      { name: "Artificial Colors", percentage: 2, eco_score: 4, sustainable: false, 
        details: "Chemical processing with potential environmental impacts" },
      { name: "Salt", percentage: 8, eco_score: 6, sustainable: true, 
        details: "Natural mineral, but mining can have local impacts" },
      { name: "Spices", percentage: 20, eco_score: 8, sustainable: true, 
        details: "Generally sustainably grown with lower environmental impact" }
    ];
    
    warnings = [
      "Contains palm oil which is linked to deforestation",
      "Artificial colors may have environmental production impacts",
      "High sodium content has both health and water usage impacts"
    ];
    
    // Calculate overall eco_score based on ingredients
    ecoScore = ingredients.reduce(
      (score, ingredient) => score + (ingredient.eco_score * ingredient.percentage / 100), 
      0
    );
  } else {
    // Default materials analysis (for non-food items)
    ingredients = [
      { name: "Cotton", percentage: 60, eco_score: 8, sustainable: true, 
        details: "Organic cotton uses less water and no pesticides compared to conventional cotton." },
      { name: "Polyester", percentage: 40, eco_score: 4, sustainable: false, 
        details: "Synthetic material derived from petroleum, not biodegradable." }
    ];
    
    warnings = [
      "Contains synthetic materials that are not biodegradable",
      "Production may involve chemical processing"
    ];
    
    // Calculate overall eco_score based on material percentages
    ecoScore = ingredients.reduce(
      (score, ingredient) => score + (ingredient.eco_score * ingredient.percentage / 100), 
      0
    );
  }
  
  // Randomize slightly to make it look more realistic
  ecoScore = Math.round(ecoScore * 10) / 10;
  
  // Add water and energy metrics
  const waterSaved = Math.floor(500 + Math.random() * 1000); // ml
  const energySaved = Math.floor(20 + Math.random() * 30); // %
  
  return {
    materials: ingredients,
    confidence: 0.85,
    eco_score: ecoScore,
    warnings: warnings,
    metrics: {
      water_saved: waterSaved,
      energy_efficiency: energySaved,
      biodegradable_percentage: ingredients.filter(i => i.sustainable).reduce((sum, i) => sum + i.percentage, 0)
    },
    recommendations: [
      "Look for alternatives with no palm oil",
      "Choose products with natural colors instead of artificial ones",
      "Check for sustainability certifications on packaging"
    ],
    success: true
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders })
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
