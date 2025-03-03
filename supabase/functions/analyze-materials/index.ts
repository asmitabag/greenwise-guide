
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock material analysis - In a real app, this would use computer vision APIs
function analyzeMaterials(imageData: string) {
  // This is a mock implementation
  // In a real app, you'd use a computer vision API to analyze the image
  console.log("Analyzing materials from image...");
  
  const mockMaterials = [
    { name: "Cotton", percentage: 60, eco_score: 8 },
    { name: "Polyester", percentage: 40, eco_score: 4 }
  ];

  // Add random variance to make it look more realistic
  const confidence = 0.75 + (Math.random() * 0.2);
  
  return {
    materials: mockMaterials,
    confidence: confidence
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Received request to analyze materials");
    const { image, productId } = await req.json()

    if (!image || !productId) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: 'Image and productId are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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
    )
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      },
    )
  }
})
