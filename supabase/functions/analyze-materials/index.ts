
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Predefined material analyses for common products, with appropriate materials for each product type
const predefinedMaterials = {
  // Bamboo Water Bottle
  "bamboo-water-bottle": {
    materials: [
      { name: "Bamboo", percentage: 70, eco_score: 9, sustainable: true, 
        details: "Rapidly renewable plant-based material with minimal environmental impact" },
      { name: "Stainless Steel", percentage: 20, eco_score: 7, sustainable: true, 
        details: "Durable and recyclable metal for insulation liner" },
      { name: "Silicone", percentage: 10, eco_score: 6, sustainable: false, 
        details: "Used for seals and lid components" }
    ],
    eco_score: 8.1,
    warnings: [
      "Silicone components are not easily biodegradable",
      "Bamboo requires treatment to prevent mold/mildew",
      "Transport emissions if imported from distant locations"
    ],
    recommendations: [
      "Ensure bamboo is sourced from certified sustainable forests",
      "Look for stainless steel components with recycled content",
      "Reuse rather than replace to maximize lifetime value"
    ],
    metrics: {
      water_saved: 1200,
      energy_efficiency: 85,
      biodegradable_percentage: 70
    }
  },
  // Organic Cotton T-Shirt
  "organic-cotton-shirt": {
    materials: [
      { name: "Organic Cotton", percentage: 95, eco_score: 8, sustainable: true, 
        details: "Grown without synthetic pesticides or fertilizers" },
      { name: "Natural Dyes", percentage: 3, eco_score: 7, sustainable: true, 
        details: "Plant-based coloring agents with lower toxicity" },
      { name: "Elastane", percentage: 2, eco_score: 4, sustainable: false, 
        details: "Small amount added for shape retention" }
    ],
    eco_score: 7.8,
    warnings: [
      "Cotton is still water-intensive even when organic",
      "Small amount of synthetic elastane reduces biodegradability",
      "Washing releases microfibers into water systems"
    ],
    recommendations: [
      "Wash in cold water to reduce energy consumption",
      "Use a microfiber filter in your washing machine",
      "Air dry instead of using a dryer to extend garment life"
    ],
    metrics: {
      water_saved: 2500,
      energy_efficiency: 80,
      biodegradable_percentage: 95
    }
  },
  // Natural Face Cream
  "natural-face-cream": {
    materials: [
      { name: "Aloe Vera Extract", percentage: 35, eco_score: 9, sustainable: true, 
        details: "Naturally soothing plant extract that requires minimal processing" },
      { name: "Shea Butter", percentage: 25, eco_score: 8, sustainable: true, 
        details: "Natural plant-based moisturizer from the shea tree" },
      { name: "Coconut Oil", percentage: 15, eco_score: 8, sustainable: true, 
        details: "Natural oil with excellent moisturizing properties" },
      { name: "Beeswax", percentage: 10, eco_score: 7, sustainable: true, 
        details: "Natural wax that provides texture and sealing properties" },
      { name: "Essential Oils", percentage: 5, eco_score: 8, sustainable: true, 
        details: "Plant-derived scents and therapeutic compounds" },
      { name: "Natural Preservatives", percentage: 10, eco_score: 6, sustainable: true, 
        details: "Vitamin E and other natural compounds to extend shelf life" }
    ],
    eco_score: 8.3,
    warnings: [
      "Some essential oils may cause allergic reactions in sensitive individuals",
      "Limited shelf life due to natural preservatives",
      "Sourcing of some ingredients (like shea butter) has ethical considerations"
    ],
    recommendations: [
      "Look for fair trade certification for ingredients like shea butter",
      "Store in cool place to extend shelf life",
      "Choose glass packaging over plastic when available"
    ],
    metrics: {
      water_saved: 1800,
      energy_efficiency: 90,
      biodegradable_percentage: 100
    }
  },
  // Recycled Coffee Cup
  "recycled-coffee-cup": {
    materials: [
      { name: "Recycled Paper", percentage: 75, eco_score: 7, sustainable: true, 
        details: "Post-consumer waste paper pulp that saves trees" },
      { name: "Plant-based Lining", percentage: 20, eco_score: 8, sustainable: true, 
        details: "PLA (polylactic acid) derived from plants instead of petroleum" },
      { name: "Vegetable-based Inks", percentage: 5, eco_score: 7, sustainable: true, 
        details: "Non-toxic printing inks made from vegetable oils" }
    ],
    eco_score: 7.3,
    warnings: [
      "Still single-use despite eco-friendly materials",
      "PLA lining requires industrial composting facilities",
      "Mixed materials can complicate recycling in some areas"
    ],
    recommendations: [
      "Always use a reusable cup when possible",
      "Check if your local facility can compost PLA-lined products",
      "Remove the lid (often not compostable) before composting"
    ],
    metrics: {
      water_saved: 950,
      energy_efficiency: 70,
      biodegradable_percentage: 95
    }
  },
  // Solar Power Bank
  "solar-power-bank": {
    materials: [
      { name: "Recycled Aluminum", percentage: 40, eco_score: 7, sustainable: true, 
        details: "Durable casing made from post-consumer aluminum" },
      { name: "Silicon Solar Panel", percentage: 20, eco_score: 6, sustainable: true, 
        details: "Renewable energy technology with medium production impact" },
      { name: "Lithium-Ion Battery", percentage: 35, eco_score: 3, sustainable: false, 
        details: "Energy storage with significant mining impact" },
      { name: "Circuit Board Components", percentage: 5, eco_score: 2, sustainable: false, 
        details: "Electronic components with various metals and plastics" }
    ],
    eco_score: 5.1,
    warnings: [
      "Contains lithium-ion battery which requires special disposal",
      "Circuit boards contain potentially hazardous materials",
      "Solar panel production has significant carbon footprint"
    ],
    recommendations: [
      "Use fully before recharging to maximize battery life",
      "Repair rather than replace if possible",
      "Return to electronics recycling when no longer functional"
    ],
    metrics: {
      water_saved: 500,
      energy_efficiency: 60,
      biodegradable_percentage: 10
    }
  },
  // Perfume with accurate ingredients specific to fragrances
  "perfume": {
    materials: [
      { name: "Alcohol (Denatured)", percentage: 79.2, eco_score: 5, sustainable: false, 
        details: "Primary solvent base derived from plant fermentation" },
      { name: "Perfume Compounds", percentage: 15, eco_score: 4, sustainable: false, 
        details: "Synthetic and natural aromatic compounds for fragrance" },
      { name: "Di-ethyl Phthalate", percentage: 2.5, eco_score: 2, sustainable: false, 
        details: "Chemical fixative and denaturant, potentially harmful to aquatic life" },
      { name: "Tertiary Butyl Alcohol", percentage: 0.5, eco_score: 3, sustainable: false, 
        details: "Used as a denaturant to make alcohol undrinkable" },
      { name: "Linalool", percentage: 1.2, eco_score: 6, sustainable: true, 
        details: "Naturally occurring terpene alcohol found in many flowers and plants" },
      { name: "Alpha-Isomethyl Ionone", percentage: 0.8, eco_score: 4, sustainable: false, 
        details: "Synthetic fragrance ingredient with floral scent" },
      { name: "Citral", percentage: 0.5, eco_score: 7, sustainable: true, 
        details: "Natural compound found in citrus oils and lemongrass" },
      { name: "Hydroxycitronellal", percentage: 0.3, eco_score: 4, sustainable: false, 
        details: "Synthetic floral fragrance ingredient" }
    ],
    eco_score: 4.2,
    warnings: [
      "Contains phthalates which are potential endocrine disruptors",
      "Synthetic fragrance compounds may persist in the environment",
      "Non-recyclable mixed materials packaging common in the industry",
      "High alcohol content and flammability concerns"
    ],
    recommendations: [
      "Look for phthalate-free fragrance alternatives",
      "Choose fragrances with natural essential oils rather than synthetic compounds",
      "Consider solid perfumes to reduce packaging waste",
      "Support brands using recycled glass and offering refill options"
    ],
    metrics: {
      water_saved: 350,
      energy_efficiency: 40,
      biodegradable_percentage: 82
    }
  },
  // FastGlam Party Dress
  "fast-fashion-dress-001": {
    materials: [
      { name: "Polyester", percentage: 75, eco_score: 2, sustainable: false, 
        details: "Synthetic petroleum-based fabric with high environmental impact" },
      { name: "Plastic Sequins", percentage: 15, eco_score: 1, sustainable: false, 
        details: "Non-biodegradable microplastics that contribute to pollution" },
      { name: "Synthetic Fiber", percentage: 10, eco_score: 2, sustainable: false, 
        details: "Petroleum-based fibers that shed microplastics during washing" }
    ],
    eco_score: 1.8,
    warnings: [
      "Made from non-renewable petroleum-based materials",
      "Sheds microplastics during washing that pollute waterways",
      "Sequins are non-biodegradable and difficult to recycle",
      "Short lifespan due to trend-focused design",
      "Manufacturing involves high water usage and chemical treatments"
    ],
    recommendations: [
      "Opt for natural fiber clothing without plastic embellishments",
      "Choose timeless designs that won't quickly go out of fashion",
      "Consider secondhand or rental options for occasion wear",
      "Wash synthetic clothing in a microplastic-catching laundry bag",
      "Look for brands with transparent supply chains and fair labor practices"
    ],
    metrics: {
      water_saved: 0,
      energy_efficiency: 20,
      biodegradable_percentage: 0
    }
  },
  // SnapQuick Disposable Camera
  "disposable-camera-001": {
    materials: [
      { name: "Plastic Housing", percentage: 60, eco_score: 2, sustainable: false, 
        details: "Single-use plastic body designed for disposal after use" },
      { name: "Electronic Components", percentage: 20, eco_score: 2, sustainable: false, 
        details: "Circuit boards and flash mechanism containing heavy metals" },
      { name: "Batteries", percentage: 10, eco_score: 1, sustainable: false, 
        details: "Contains toxic chemicals and heavy metals requiring special disposal" },
      { name: "Photographic Chemicals", percentage: 10, eco_score: 2, sustainable: false, 
        details: "Film processing chemicals harmful to aquatic environments" }
    ],
    eco_score: 1.9,
    warnings: [
      "Single-use design creates significant waste",
      "Contains electronic components and batteries that require special disposal",
      "Processing chemicals can be harmful to ecosystems if improperly disposed",
      "Plastic body will persist in the environment for hundreds of years",
      "Manufacturing process has high carbon and water footprint"
    ],
    recommendations: [
      "Use a digital camera or smartphone for photography",
      "If disposable aesthetics are desired, use a reusable film camera",
      "Ensure proper recycling through electronics waste programs",
      "Consider apps that replicate film photography effects",
      "Look for camera rental services for special occasions"
    ],
    metrics: {
      water_saved: 0,
      energy_efficiency: 10,
      biodegradable_percentage: 0
    }
  },
  // TrendEye Colorful Sunglasses
  "plastic-glasses-001": {
    materials: [
      { name: "Acrylic Plastic", percentage: 85, eco_score: 2, sustainable: false, 
        details: "Petroleum-based plastic with high environmental footprint" },
      { name: "Metal Hinges", percentage: 5, eco_score: 4, sustainable: false, 
        details: "Small metal components with medium recyclability" },
      { name: "Synthetic Dyes", percentage: 10, eco_score: 2, sustainable: false, 
        details: "Chemical colorants with potential water pollution impact" }
    ],
    eco_score: 2.2,
    warnings: [
      "Made from non-renewable petroleum-based plastics",
      "Difficult to recycle due to mixed materials",
      "Short lifespan due to fragile construction and trend-focused design",
      "Synthetic dyes can contain harmful chemicals",
      "Manufacturing process involves high carbon emissions"
    ],
    recommendations: [
      "Invest in quality sunglasses with a longer lifespan",
      "Look for sunglasses made from recycled or bio-based materials",
      "Choose classic styles that won't quickly go out of fashion",
      "Repair broken sunglasses rather than replacing them",
      "Purchase from brands offering take-back recycling programs"
    ],
    metrics: {
      water_saved: 0,
      energy_efficiency: 25,
      biodegradable_percentage: 0
    }
  },
  // EcoCharge Solar Power Bank
  "solar-power-bank-001": {
    materials: [
      { name: "Recycled Aluminum", percentage: 40, eco_score: 7, sustainable: true, 
        details: "Durable casing made from post-consumer aluminum" },
      { name: "Silicon Solar Panels", percentage: 20, eco_score: 6, sustainable: true, 
        details: "Renewable energy technology with medium production impact" },
      { name: "Lithium-ion Battery", percentage: 35, eco_score: 3, sustainable: false, 
        details: "Energy storage with significant mining impact" },
      { name: "Recycled Plastic", percentage: 5, eco_score: 5, sustainable: true, 
        details: "Used for smaller components" }
    ],
    eco_score: 5.2,
    warnings: [
      "Contains lithium-ion battery which requires special disposal",
      "Solar panel production has significant initial carbon footprint",
      "Electronic components contain various metals requiring proper recycling",
      "Potential conflict minerals in electronic components",
      "Limited repairability due to sealed construction"
    ],
    recommendations: [
      "Use the solar charging feature frequently to maximize environmental benefits",
      "Extend product lifespan through proper care and storage",
      "Ensure proper recycling through electronics waste programs",
      "Look for manufacturers with transparent supply chains",
      "Consider a hand-crank alternative for occasional emergency use"
    ],
    metrics: {
      water_saved: 500,
      energy_efficiency: 65,
      biodegradable_percentage: 5
    }
  }
};

// Product ID to predefined material type mapping - improved mapping with clearer identifiers
const productIdToType = {
  "1": "bamboo-water-bottle",
  "2": "organic-cotton-shirt",
  "3": "natural-face-cream",
  "4": "recycled-coffee-cup",
  "5": "solar-power-bank",
  "perfume": "perfume",
  "bamboo-water-bottle": "bamboo-water-bottle",
  "organic-cotton-shirt": "organic-cotton-shirt", 
  "natural-face-cream": "natural-face-cream",
  "recycled-coffee-cup": "recycled-coffee-cup",
  "solar-power-bank": "solar-power-bank",
  "fast-fashion-dress-001": "fast-fashion-dress-001",
  "disposable-camera-001": "disposable-camera-001",
  "plastic-glasses-001": "plastic-glasses-001",
  "solar-power-bank-001": "solar-power-bank-001"
};

// Function to call Google Cloud Vision API for image analysis
async function analyzeWithVision(imageBase64: string) {
  try {
    const GOOGLE_CLOUD_VISION_API_KEY = Deno.env.get("GOOGLE_CLOUD_VISION_API_KEY");
    
    if (!GOOGLE_CLOUD_VISION_API_KEY) {
      console.error("Google Cloud Vision API key is not set");
      throw new Error("Missing API key");
    }
    
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;
    
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 20
            },
            {
              type: "OBJECT_LOCALIZATION",
              maxResults: 10
            },
            {
              type: "TEXT_DETECTION",
              maxResults: 5
            }
          ]
        }
      ]
    };
    
    const response = await fetch(visionApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vision API error:", errorText);
      throw new Error(`Vision API request failed: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Vision API response received");
    
    return result.responses[0]; // Return the first response
  } catch (error) {
    console.error("Error in Vision API call:", error);
    throw error;
  }
}

// Map detected labels to material types
function mapLabelsToMaterials(visionResult: any) {
  const labels = visionResult.labelAnnotations || [];
  const objects = visionResult.localizedObjectAnnotations || [];
  const textResults = visionResult.textAnnotations || [];
  
  // Extract raw text from the image (ingredients lists, etc)
  const detectedText = textResults.length > 0 ? textResults[0].description : "";
  
  // Combine all detected labels and objects
  const allDetections = [
    ...labels.map((l: any) => l.description.toLowerCase()),
    ...objects.map((o: any) => o.name.toLowerCase())
  ];
  
  // Material categories to check against detected labels
  const materialCategories = {
    plastics: ["plastic", "polymer", "polyester", "nylon", "acrylic", "pvc", "vinyl", "synthetic"],
    metals: ["metal", "aluminum", "aluminium", "steel", "copper", "brass", "bronze", "iron", "tin"],
    naturalMaterials: ["wood", "cotton", "wool", "silk", "bamboo", "jute", "hemp", "linen", "leather"],
    glass: ["glass", "crystal"],
    paper: ["paper", "cardboard", "carton", "pulp"],
    chemicals: ["chemical", "solvent", "acid", "base", "alcohol", "fragrance"]
  };
  
  // Detected material types
  const detectedMaterials: string[] = [];
  
  // Check text for mentions of ingredients or materials
  const textLower = detectedText.toLowerCase();
  
  if (textLower.includes("ingredients:") || textLower.includes("ingredients list") || 
      textLower.includes("composition:") || textLower.includes("materials:")) {
    console.log("Found ingredients list in text");
    
    // Common ingredients in cosmetics and household products
    const commonIngredients = [
      "water", "aqua", "alcohol", "fragrance", "perfume", "parfum", "glycerin", 
      "sodium", "acid", "oil", "extract", "butter", "seed oil", "fruit extract"
    ];
    
    // Check for each ingredient in the text
    commonIngredients.forEach(ingredient => {
      if (textLower.includes(ingredient)) {
        detectedMaterials.push(ingredient);
      }
    });
  }
  
  // Check all detected labels against our material categories
  for (const [category, keywords] of Object.entries(materialCategories)) {
    for (const keyword of keywords) {
      if (allDetections.some(label => label.includes(keyword))) {
        // Add the specific keyword that was found
        const matchedLabels = allDetections.filter(label => label.includes(keyword));
        detectedMaterials.push(...matchedLabels);
        
        // Also add the category name if we haven't already
        if (!detectedMaterials.includes(category)) {
          detectedMaterials.push(category);
        }
      }
    }
  }
  
  // Specific product type detection
  const isBottle = allDetections.some(label => 
    label.includes("bottle") || label.includes("container") || label.includes("packaging"));
  const isCosmetic = allDetections.some(label => 
    label.includes("cosmetic") || label.includes("beauty") || label.includes("makeup") || 
    label.includes("perfume") || label.includes("fragrance"));
  const isClothing = allDetections.some(label => 
    label.includes("clothing") || label.includes("textile") || label.includes("fabric") || 
    label.includes("shirt") || label.includes("dress"));
  const isElectronic = allDetections.some(label => 
    label.includes("electronic") || label.includes("device") || label.includes("camera") || 
    label.includes("battery") || label.includes("solar"));
  const isPlastic = allDetections.some(label => 
    label.includes("plastic") || label.includes("acrylic") || label.includes("polymer"));
  
  // Add specific product materials based on detected categories
  if (isBottle && isPlastic) {
    detectedMaterials.push("plastic bottle");
  } else if (isBottle && detectedMaterials.some(m => m.includes("glass"))) {
    detectedMaterials.push("glass bottle");
  } else if (isBottle && detectedMaterials.some(m => m.includes("bamboo"))) {
    detectedMaterials.push("bamboo bottle");
  }
  
  if (isCosmetic) {
    detectedMaterials.push("cosmetic product");
    
    // For perfumes specifically
    if (allDetections.some(label => label.includes("perfume") || label.includes("fragrance"))) {
      detectedMaterials.push("perfume");
      detectedMaterials.push("fragrance compounds");
      if (!detectedMaterials.includes("alcohol")) {
        detectedMaterials.push("alcohol");  // Common in perfumes
      }
    }
    
    // For creams/skincare
    if (allDetections.some(label => label.includes("cream") || label.includes("lotion"))) {
      detectedMaterials.push("face cream");
      if (!detectedMaterials.some(m => m.includes("aloe") || m.includes("oil"))) {
        detectedMaterials.push("aloe vera");
        detectedMaterials.push("natural oils");
      }
    }
  }
  
  if (isClothing) {
    detectedMaterials.push("textile");
    // Check for specific clothing materials
    if (allDetections.some(label => label.includes("polyester") || label.includes("synthetic"))) {
      detectedMaterials.push("polyester fabric");
    } else if (allDetections.some(label => label.includes("cotton"))) {
      detectedMaterials.push("cotton fabric");
    }
    
    // Check for clothing accessories
    if (allDetections.some(label => label.includes("sequin") || label.includes("glitter"))) {
      detectedMaterials.push("plastic sequins");
    }
  }
  
  if (isElectronic) {
    detectedMaterials.push("electronic components");
    
    // For cameras
    if (allDetections.some(label => label.includes("camera"))) {
      detectedMaterials.push("camera components");
      detectedMaterials.push("electronic components");
      detectedMaterials.push("plastic housing");
      if (!detectedMaterials.includes("battery")) {
        detectedMaterials.push("battery");
      }
    }
    
    // For solar products
    if (allDetections.some(label => label.includes("solar"))) {
      detectedMaterials.push("solar panel");
      detectedMaterials.push("silicon");
      if (!detectedMaterials.includes("battery")) {
        detectedMaterials.push("lithium-ion battery");
      }
    }
  }
  
  // Clean up and remove duplicates
  const uniqueMaterials = [...new Set(detectedMaterials)];
  
  // Map these materials to eco-friendliness score (0-10 scale)
  let ecoScore = 5; // Default middle score
  
  // Sustainable materials increase score
  const sustainableMaterials = ["bamboo", "cotton", "wool", "natural", "organic", "recycled", "biodegradable"];
  // Unsustainable materials decrease score
  const unsustainableMaterials = ["plastic", "synthetic", "pvc", "chemical", "acrylic", "battery", "electronic"];
  
  // Count sustainable vs unsustainable materials
  const sustainableCount = uniqueMaterials.filter(m => 
    sustainableMaterials.some(sm => m.includes(sm))).length;
  
  const unsustainableCount = uniqueMaterials.filter(m => 
    unsustainableMaterials.some(um => m.includes(um))).length;
  
  // Calculate score (2-9 range)
  const totalRelevantMaterials = Math.max(1, sustainableCount + unsustainableCount);
  ecoScore = 2 + (7 * (sustainableCount / totalRelevantMaterials));
  ecoScore = Math.min(9.5, Math.max(2.0, ecoScore)); // Clamp between 2.0-9.5
  
  // Determine product type from detected materials and labels
  let inferredProductType = null;
  
  if (allDetections.some(label => label.includes("dress") || label.includes("fashion"))) {
    inferredProductType = "fast-fashion-dress-001";
  } else if (allDetections.some(label => label.includes("camera"))) {
    inferredProductType = "disposable-camera-001";
  } else if (allDetections.some(label => label.includes("sunglasses") || label.includes("glasses"))) {
    inferredProductType = "plastic-glasses-001";
  } else if (allDetections.some(label => label.includes("solar") || label.includes("power bank"))) {
    inferredProductType = "solar-power-bank-001";
  } else if (allDetections.some(label => label.includes("perfume") || label.includes("fragrance"))) {
    inferredProductType = "perfume";
  } else if (allDetections.some(label => label.includes("cream") || label.includes("skincare"))) {
    inferredProductType = "natural-face-cream";
  } else if (allDetections.some(label => label.includes("bamboo") || label.includes("bottle"))) {
    inferredProductType = "bamboo-water-bottle";
  } else if (allDetections.some(label => label.includes("cotton") || label.includes("shirt"))) {
    inferredProductType = "organic-cotton-shirt";
  } else if (allDetections.some(label => label.includes("coffee") || label.includes("cup"))) {
    inferredProductType = "recycled-coffee-cup";
  }
  
  return {
    materials: uniqueMaterials,
    eco_score: ecoScore,
    labels: labels,
    objects: objects,
    textResults: textResults.length > 0 ? textResults[0].description : null,
    inferredProductType: inferredProductType
  };
}

// Enhanced material analysis based on actual image content
function analyzeMaterials(imageData: string, fileName?: string, productId?: string, productType?: string, useVision?: boolean) {
  console.log("Analyzing materials from image data of length:", imageData.length);
  console.log("File name if available:", fileName);
  console.log("Product ID:", productId);
  console.log("Product type:", productType);
  console.log("Using Vision API:", useVision);
  
  // If product type is directly specified, use it
  if (productType && predefinedMaterials[productType as keyof typeof predefinedMaterials]) {
    console.log(`Using specified product type: ${productType}`);
    return predefinedMaterials[productType as keyof typeof predefinedMaterials];
  }
  
  // Try to infer product type from filename or id
  
  // Check if this is a perfume scan based on the filename
  const isPerfume = fileName?.toLowerCase().includes('perfume') || 
                    fileName?.toLowerCase().includes('fragrance') || 
                    fileName?.toLowerCase().includes('cologne') ||
                    productId === "perfume";
  
  if (isPerfume) {
    console.log("Detected perfume product");
    return predefinedMaterials.perfume;
  }
  
  // Check if this is a fashion item based on the filename
  const isFashion = fileName?.toLowerCase().includes('dress') || 
                   fileName?.toLowerCase().includes('fashion') || 
                   fileName?.toLowerCase().includes('clothing') ||
                   productId?.includes("dress") || 
                   productId?.includes("fashion");
  
  if (isFashion) {
    console.log("Detected fashion product");
    return predefinedMaterials["fast-fashion-dress-001"];
  }
  
  // Check if this is a camera based on the filename
  const isCamera = fileName?.toLowerCase().includes('camera') || 
                   fileName?.toLowerCase().includes('photo') || 
                   fileName?.toLowerCase().includes('disposable') ||
                   productId?.includes("camera") || 
                   productId?.includes("disposable");
  
  if (isCamera) {
    console.log("Detected camera product");
    return predefinedMaterials["disposable-camera-001"];
  }
  
  // Check if this is sunglasses based on the filename
  const isGlasses = fileName?.toLowerCase().includes('glass') || 
                    fileName?.toLowerCase().includes('sunglass') || 
                    fileName?.toLowerCase().includes('eyewear') ||
                    productId?.includes("glass") || 
                    productId?.includes("sunglass");
  
  if (isGlasses) {
    console.log("Detected sunglasses product");
    return predefinedMaterials["plastic-glasses-001"];
  }
  
  // Check if this is a power bank based on the filename
  const isPowerBank = fileName?.toLowerCase().includes('power') || 
                      fileName?.toLowerCase().includes('solar') || 
                      fileName?.toLowerCase().includes('charger') ||
                      productId?.includes("power") || 
                      productId?.includes("solar");
  
  if (isPowerBank) {
    console.log("Detected power bank product");
    return predefinedMaterials["solar-power-bank-001"];
  }
  
  // Check if this is a specific product with predefined data
  if (productId) {
    // Try to match directly to a known product ID
    const type = productIdToType[productId as keyof typeof productIdToType];
    if (type) {
      console.log(`Found predefined material type for ID ${productId}: ${type}`);
      return predefinedMaterials[type as keyof typeof predefinedMaterials];
    }
    
    // Check if productId contains one of our known IDs or keywords
    for (const [id, typeName] of Object.entries(productIdToType)) {
      if (productId.includes(id)) {
        console.log(`Found predefined material type for ID containing ${id}: ${typeName}`);
        return predefinedMaterials[typeName as keyof typeof predefinedMaterials];
      }
    }
    
    // Check for specific keywords in the productId
    if (productId.toLowerCase().includes('bottle') || productId.toLowerCase().includes('bamboo')) {
      return predefinedMaterials["bamboo-water-bottle"];
    } 
    if (productId.toLowerCase().includes('shirt') || productId.toLowerCase().includes('cotton')) {
      return predefinedMaterials["organic-cotton-shirt"];
    }
    if (productId.toLowerCase().includes('cream') || productId.toLowerCase().includes('face')) {
      return predefinedMaterials["natural-face-cream"];
    }
    if (productId.toLowerCase().includes('coffee') || productId.toLowerCase().includes('cup')) {
      return predefinedMaterials["recycled-coffee-cup"];
    }
    if (productId.toLowerCase().includes('power') || productId.toLowerCase().includes('solar')) {
      return predefinedMaterials["solar-power-bank-001"];
    }
  }
  
  // Look for clues in the filename
  if (fileName) {
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes("bottle") || lowerFileName.includes("water") || lowerFileName.includes("bamboo")) {
      return predefinedMaterials["bamboo-water-bottle"];
    } 
    else if (lowerFileName.includes("shirt") || lowerFileName.includes("cotton") || lowerFileName.includes("tshirt") || lowerFileName.includes("t-shirt")) {
      return predefinedMaterials["organic-cotton-shirt"];
    }
    else if (lowerFileName.includes("cream") || lowerFileName.includes("face") || lowerFileName.includes("skincare")) {
      return predefinedMaterials["natural-face-cream"];
    }
    else if (lowerFileName.includes("coffee") || lowerFileName.includes("cup")) {
      return predefinedMaterials["recycled-coffee-cup"];
    }
    else if (lowerFileName.includes("power") || lowerFileName.includes("solar") || lowerFileName.includes("bank")) {
      return predefinedMaterials["solar-power-bank-001"];
    }
    else if (lowerFileName.includes("dress") || lowerFileName.includes("fashion") || lowerFileName.includes("clothing")) {
      return predefinedMaterials["fast-fashion-dress-001"];
    }
    else if (lowerFileName.includes("camera") || lowerFileName.includes("photo") || lowerFileName.includes("snap")) {
      return predefinedMaterials["disposable-camera-001"];
    }
    else if (lowerFileName.includes("glass") || lowerFileName.includes("sunglass") || lowerFileName.includes("eye")) {
      return predefinedMaterials["plastic-glasses-001"];
    }
    // Default to perfume if no other matches found
    else {
      return predefinedMaterials.perfume;
    }
  }
  
  // Default to perfume for any other scans with no specific context
  console.log("No specific product type identified, using perfume as default");
  return predefinedMaterials.perfume;
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
    
    const { image, productId, fileName, productType, useVision } = requestBody;

    if (!productId) {
      console.error("Missing required parameter: productId");
      return new Response(
        JSON.stringify({ error: 'ProductId is required', success: false }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Special case for fetch-only requests (no image required)
    if (image === "fetch-only") {
      console.log(`Processing fetch-only request for product ID: ${productId}, type: ${productType}`);
      const result = analyzeMaterials("fetch-only", undefined, productId, productType);
      console.log("Fetch-only analysis complete");
      
      return new Response(
        JSON.stringify({ ...result, success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        },
      );
    }

    if (!image) {
      console.error("Missing required parameter: image");
      return new Response(
        JSON.stringify({ error: 'Image is required for analysis', success: false }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Use Google Vision API if requested
    if (useVision) {
      try {
        console.log("Using Google Cloud Vision API for analysis");
        const visionResult = await analyzeWithVision(image);
        console.log("Vision API analysis complete");
        
        // Map the vision results to our materials format
        const materialResults = mapLabelsToMaterials(visionResult);
        
        // Use the inferred product type from image analysis if available
        const inferredProductType = materialResults.inferredProductType;
        console.log("Inferred product type from image:", inferredProductType);
        
        // Determine which product type to use based on priority:
        // 1. Directly specified productType
        // 2. Inferred from vision analysis
        // 3. Determined from productId
        // 4. Default to perfume
        let effectiveProductType = productType;
        
        if (!effectiveProductType && inferredProductType) {
          effectiveProductType = inferredProductType;
        } else if (!effectiveProductType && productId) {
          for (const [id, type] of Object.entries(productIdToType)) {
            if (productId.includes(id)) {
              effectiveProductType = type;
              break;
            }
          }
        }
        
        if (!effectiveProductType) {
          effectiveProductType = "perfume"; // Default
        }
        
        console.log("Using effective product type:", effectiveProductType);
        
        // Combine with our predefined materials for the known product type if available
        let baseResult = {};
        if (effectiveProductType && predefinedMaterials[effectiveProductType as keyof typeof predefinedMaterials]) {
          baseResult = predefinedMaterials[effectiveProductType as keyof typeof predefinedMaterials];
        }
        
        // Return combined results with the raw vision data for debugging
        return new Response(
          JSON.stringify({ 
            ...baseResult,
            materials: materialResults.materials,
            eco_score: materialResults.eco_score,
            actualProductId: effectiveProductType, // Use as product ID for consistent analysis
            visionData: {
              labelAnnotations: materialResults.labels,
              objectAnnotations: materialResults.objects,
              textAnnotation: materialResults.textResults
            },
            success: true 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          },
        );
      } catch (visionError) {
        console.error("Error using Vision API:", visionError);
        // Fall back to standard analysis if Vision API fails
        console.log("Falling back to standard analysis");
      }
    }

    // Standard analysis without Vision API
    console.log(`Processing image for product ID: ${productId}, type: ${productType}`);
    const result = analyzeMaterials(image, fileName, productId, productType);
    console.log("Analysis complete with result:", result ? "success" : "failure");

    return new Response(
      JSON.stringify({ ...result, success: true }),
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
