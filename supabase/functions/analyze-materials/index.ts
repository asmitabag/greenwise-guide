
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock material analysis - In a real app, this would use computer vision APIs
function analyzeMaterials(imageData: string) {
  // This is a mock implementation
  // In a real app, you'd use a computer vision API to analyze the image
  console.log("Analyzing materials from image data of length:", imageData.length);
  
  // Create a more detailed and realistic analysis result
  // In a production app, this would use ML to actually analyze the image
  const materials = [
    { name: "Cotton", percentage: 60, eco_score: 8, sustainable: true, 
      details: "Organic cotton uses less water and no pesticides compared to conventional cotton." },
    { name: "Polyester", percentage: 40, eco_score: 4, sustainable: false, 
      details: "Synthetic material derived from petroleum, not biodegradable." }
  ];

  // Randomize the percentages slightly to make it look more realistic
  const randomizePercentage = (basePercentage: number) => {
    const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    return Math.max(5, Math.min(95, basePercentage + variance));
  };

  const randomizedMaterials = materials.map(material => ({
    ...material,
    percentage: randomizePercentage(material.percentage)
  }));
  
  // Adjust percentages to ensure they sum to 100%
  const sum = randomizedMaterials.reduce((acc, mat) => acc + mat.percentage, 0);
  randomizedMaterials[0].percentage += (100 - sum);
  
  // Add random variance to make it look more realistic
  const confidence = 0.75 + (Math.random() * 0.2);
  
  // Calculate overall eco_score based on material percentages
  const overallEcoScore = randomizedMaterials.reduce(
    (score, material) => score + (material.eco_score * material.percentage / 100), 
    0
  ).toFixed(1);
  
  // Add water and energy metrics
  const waterSaved = Math.floor(500 + Math.random() * 1000); // ml
  const energySaved = Math.floor(20 + Math.random() * 30); // %
  
  return {
    materials: randomizedMaterials,
    confidence: confidence,
    eco_score: parseFloat(overallEcoScore),
    metrics: {
      water_saved: waterSaved,
      energy_efficiency: energySaved,
      biodegradable_percentage: randomizedMaterials[0].percentage // assume cotton is biodegradable
    },
    recommendations: [
      "Look for 100% organic cotton or recycled materials for better sustainability",
      "Avoid products with more than 30% synthetic materials",
      "Check for certifications like GOTS or OEKO-TEX"
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
    
    const { image, productId } = requestBody;

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
    const result = analyzeMaterials(image);
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
