
// Product mappings and utility functions for analysis
export const productMaterialMappings = {
  // Bamboo Water Bottle - ID: 1
  "1": [ 
    { 
      id: "1-1",
      name: "Bamboo", 
      percentage: 70, 
      eco_score: 8.5, 
      sustainable: true, 
      details: "Sustainable, fast-growing natural material",
      carbon_footprint: 0.5,
      water_usage: 30,
      recyclability_rating: 8,
      biodegradability_rating: 9,
      certification_ids: ["cert-1", "cert-3"]
    },
    { 
      id: "1-2",
      name: "Stainless Steel", 
      percentage: 25, 
      eco_score: 6.0, 
      sustainable: true, 
      details: "Durable and recyclable metal components",
      carbon_footprint: 2.1,
      water_usage: 50,
      recyclability_rating: 9,
      biodegradability_rating: 2,
      certification_ids: ["cert-2"]
    },
    { 
      id: "1-3",
      name: "Silicone", 
      percentage: 5, 
      eco_score: 5.0, 
      sustainable: false, 
      details: "Used for seals and gaskets",
      carbon_footprint: 3.2,
      water_usage: 80,
      recyclability_rating: 5,
      biodegradability_rating: 2,
      certification_ids: []
    }
  ],
  // Organic Cotton T-shirt - ID: 2
  "2": [ 
    { 
      id: "2-1",
      name: "Organic Cotton", 
      percentage: 95, 
      eco_score: 7.5, 
      sustainable: true, 
      details: "Grown without synthetic pesticides or fertilizers",
      carbon_footprint: 1.2,
      water_usage: 180,
      recyclability_rating: 7,
      biodegradability_rating: 9,
      certification_ids: ["cert-1", "cert-4"]
    },
    { 
      id: "2-2",
      name: "Natural Dyes", 
      percentage: 3, 
      eco_score: 8.0, 
      sustainable: true, 
      details: "Plant-based coloring with low environmental impact",
      carbon_footprint: 0.8,
      water_usage: 60,
      recyclability_rating: 6,
      biodegradability_rating: 8,
      certification_ids: ["cert-4"]
    },
    { 
      id: "2-3",
      name: "Elastane", 
      percentage: 2, 
      eco_score: 4.0, 
      sustainable: false, 
      details: "Small amount added for shape retention",
      carbon_footprint: 4.5,
      water_usage: 120,
      recyclability_rating: 3,
      biodegradability_rating: 2,
      certification_ids: []
    }
  ],
  // Natural Face Cream - ID: 3
  "3": [ 
    { 
      id: "3-1",
      name: "Aloe Vera Gel", 
      percentage: 50, 
      eco_score: 9.0, 
      sustainable: true, 
      details: "Natural moisturizing plant extract",
      carbon_footprint: 0.3,
      water_usage: 30,
      recyclability_rating: 8,
      biodegradability_rating: 10,
      certification_ids: ["cert-1", "cert-4"]
    },
    { 
      id: "3-2",
      name: "Shea Butter", 
      percentage: 30, 
      eco_score: 8.5, 
      sustainable: true, 
      details: "Natural plant-based emollient",
      carbon_footprint: 0.7,
      water_usage: 35,
      recyclability_rating: 8,
      biodegradability_rating: 9,
      certification_ids: ["cert-4"]
    },
    { 
      id: "3-3",
      name: "Organic Oils & Extracts", 
      percentage: 20, 
      eco_score: 8.0, 
      sustainable: true, 
      details: "Plant-based oils with minimal environmental impact",
      carbon_footprint: 1.1,
      water_usage: 15,
      recyclability_rating: 7,
      biodegradability_rating: 8,
      certification_ids: ["cert-3"]
    }
  ],
  // Recycled Coffee Cup - ID: 4
  "4": [ 
    { 
      id: "4-1",
      name: "Recycled Paper", 
      percentage: 80, 
      eco_score: 7.0, 
      sustainable: true, 
      details: "Made from post-consumer waste paper",
      carbon_footprint: 1.2,
      water_usage: 20,
      recyclability_rating: 9,
      biodegradability_rating: 8,
      certification_ids: ["cert-1", "cert-2"]
    },
    { 
      id: "4-2",
      name: "Plant-based Lining", 
      percentage: 15, 
      eco_score: 8.0, 
      sustainable: true, 
      details: "Biodegradable alternative to plastic lining",
      carbon_footprint: 1.5,
      water_usage: 40,
      recyclability_rating: 6,
      biodegradability_rating: 7,
      certification_ids: ["cert-3"]
    },
    { 
      id: "4-3",
      name: "Vegetable Inks", 
      percentage: 5, 
      eco_score: 8.5, 
      sustainable: true, 
      details: "Non-toxic printing materials",
      carbon_footprint: 0.9,
      water_usage: 15,
      recyclability_rating: 5,
      biodegradability_rating: 7,
      certification_ids: ["cert-4"]
    }
  ],
  // Solar Power Bank - ID: 5
  "5": [ 
    { 
      id: "5-1",
      name: "Recycled Aluminum", 
      percentage: 40, 
      eco_score: 7.0, 
      sustainable: true, 
      details: "Durable casing made from post-consumer aluminum",
      carbon_footprint: 3.5,
      water_usage: 70,
      recyclability_rating: 9,
      biodegradability_rating: 1,
      certification_ids: ["cert-2"]
    },
    { 
      id: "5-2",
      name: "Silicon Solar Panels", 
      percentage: 20, 
      eco_score: 6.0, 
      sustainable: true, 
      details: "Renewable energy technology with medium production impact",
      carbon_footprint: 8.2,
      water_usage: 120,
      recyclability_rating: 5,
      biodegradability_rating: 1,
      certification_ids: []
    },
    { 
      id: "5-3",
      name: "Lithium-ion Battery", 
      percentage: 35, 
      eco_score: 4.0, 
      sustainable: false, 
      details: "Energy storage with significant environmental concerns",
      carbon_footprint: 12.5,
      water_usage: 200,
      recyclability_rating: 4,
      biodegradability_rating: 0,
      certification_ids: []
    },
    { 
      id: "5-4",
      name: "Recycled Plastic", 
      percentage: 5, 
      eco_score: 5.0, 
      sustainable: true, 
      details: "Used for smaller components",
      carbon_footprint: 9.8,
      water_usage: 150,
      recyclability_rating: 3,
      biodegradability_rating: 0,
      certification_ids: []
    }
  ],
  // Biodegradable Bamboo Toothbrush
  "biodegradable-bamboo-toothbrush": [
    { 
      id: "bbt-1",
      name: "Bamboo", 
      percentage: 85, 
      eco_score: 9.0, 
      sustainable: true, 
      details: "Renewable resource that grows quickly without pesticides",
      carbon_footprint: 0.4,
      water_usage: 25,
      recyclability_rating: 6,
      biodegradability_rating: 9,
      certification_ids: ["cert-1", "cert-3"]
    },
    { 
      id: "bbt-2",
      name: "Plant-Based Bristles", 
      percentage: 10, 
      eco_score: 7.5, 
      sustainable: true, 
      details: "Made from castor bean oil instead of petroleum-based nylon",
      carbon_footprint: 1.2,
      water_usage: 45,
      recyclability_rating: 6,
      biodegradability_rating: 8,
      certification_ids: ["cert-3", "cert-4"]
    },
    { 
      id: "bbt-3",
      name: "Compostable Packaging", 
      percentage: 5, 
      eco_score: 8.5, 
      sustainable: true, 
      details: "Made from recycled and biodegradable kraft paper",
      carbon_footprint: 0.6,
      water_usage: 15,
      recyclability_rating: 9,
      biodegradability_rating: 10,
      certification_ids: ["cert-1", "cert-2", "cert-3"]
    }
  ],
  // Recycled Ocean Plastic Shoes
  "recycled-ocean-plastic-shoes": [
    { 
      id: "rops-1",
      name: "Recycled Ocean Plastic", 
      percentage: 65, 
      eco_score: 8.0, 
      sustainable: true, 
      details: "Plastic waste collected from oceans and coastlines",
      carbon_footprint: 1.8,
      water_usage: 40,
      recyclability_rating: 7,
      biodegradability_rating: 2,
      certification_ids: ["cert-1", "cert-2"]
    },
    { 
      id: "rops-2",
      name: "Natural Rubber", 
      percentage: 25, 
      eco_score: 7.0, 
      sustainable: true, 
      details: "Responsibly sourced sole material with good durability",
      carbon_footprint: 2.2,
      water_usage: 55,
      recyclability_rating: 5,
      biodegradability_rating: 7,
      certification_ids: ["cert-3"]
    },
    { 
      id: "rops-3",
      name: "Organic Cotton", 
      percentage: 10, 
      eco_score: 8.5, 
      sustainable: true, 
      details: "Used for laces and inner lining",
      carbon_footprint: 1.1,
      water_usage: 70,
      recyclability_rating: 8,
      biodegradability_rating: 9,
      certification_ids: ["cert-4"]
    }
  ],
  // Generic plastic product for anything plastic-based
  "plastic": [ 
    { 
      id: "plastic-1",
      name: "Plastic", 
      percentage: 100, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Non-biodegradable petroleum-based material with high environmental impact",
      carbon_footprint: 15.0,
      water_usage: 200,
      recyclability_rating: 3,
      biodegradability_rating: 1,
      certification_ids: []
    }
  ]
};

// Add named aliases for each product type to ensure proper mapping
productMaterialMappings["bamboo-water-bottle"] = productMaterialMappings["1"];
productMaterialMappings["organic-cotton-shirt"] = productMaterialMappings["2"];
productMaterialMappings["natural-face-cream"] = productMaterialMappings["3"];
productMaterialMappings["recycled-coffee-cup"] = productMaterialMappings["4"];
productMaterialMappings["solar-power-bank"] = productMaterialMappings["5"];
productMaterialMappings["toothbrush"] = productMaterialMappings["biodegradable-bamboo-toothbrush"];
productMaterialMappings["bamboo-toothbrush"] = productMaterialMappings["biodegradable-bamboo-toothbrush"];
productMaterialMappings["shoes"] = productMaterialMappings["recycled-ocean-plastic-shoes"];
productMaterialMappings["footwear"] = productMaterialMappings["recycled-ocean-plastic-shoes"];
productMaterialMappings["solar-power-bank-001"] = productMaterialMappings["5"];
productMaterialMappings["bottle"] = productMaterialMappings["1"];
productMaterialMappings["water-bottle"] = productMaterialMappings["1"];
productMaterialMappings["t-shirt"] = productMaterialMappings["2"];
productMaterialMappings["shirt"] = productMaterialMappings["2"];
productMaterialMappings["cotton-shirt"] = productMaterialMappings["2"];
productMaterialMappings["face-cream"] = productMaterialMappings["3"];
productMaterialMappings["cream"] = productMaterialMappings["3"];
productMaterialMappings["coffee-cup"] = productMaterialMappings["4"];
productMaterialMappings["cup"] = productMaterialMappings["4"];
productMaterialMappings["power-bank"] = productMaterialMappings["5"];
productMaterialMappings["powerbank"] = productMaterialMappings["5"];

export const productDescriptions = {
  "1": "Bamboo Water Bottle",
  "2": "Organic Cotton T-shirt",
  "3": "Natural Face Cream",
  "4": "Recycled Coffee Cup",
  "5": "Solar Power Bank",
  "perfume": "Fragrance",
  "plastic": "Plastic Product",
  "bamboo-water-bottle": "Bamboo Water Bottle",
  "organic-cotton-shirt": "Organic Cotton T-shirt",
  "natural-face-cream": "Natural Face Cream",
  "recycled-coffee-cup": "Recycled Coffee Cup",
  "solar-power-bank": "Solar Power Bank",
  "fast-fashion-dress-001": "FastGlam Party Dress",
  "disposable-camera-001": "SnapQuick Disposable Camera Kit",
  "plastic-glasses-001": "TrendEye Colorful Sunglasses Set",
  "solar-power-bank-001": "EcoCharge Solar Power Bank",
  "biodegradable-bamboo-toothbrush": "Biodegradable Bamboo Toothbrush",
  "recycled-ocean-plastic-shoes": "Recycled Ocean Plastic Shoes",
  "bottle": "Bamboo Water Bottle",
  "water-bottle": "Bamboo Water Bottle",
  "t-shirt": "Organic Cotton T-shirt",
  "shirt": "Organic Cotton T-shirt",
  "cotton-shirt": "Organic Cotton T-shirt",
  "face-cream": "Natural Face Cream",
  "cream": "Natural Face Cream",
  "coffee-cup": "Recycled Coffee Cup",
  "cup": "Recycled Coffee Cup",
  "power-bank": "Solar Power Bank",
  "powerbank": "Solar Power Bank",
  "toothbrush": "Biodegradable Bamboo Toothbrush",
  "bamboo-toothbrush": "Biodegradable Bamboo Toothbrush",
  "shoes": "Recycled Ocean Plastic Shoes",
  "footwear": "Recycled Ocean Plastic Shoes"
};

export const determineProductKey = (id: string): string => {
  console.log("Determining product key for:", id);
  const trimmedId = id.trim().toLowerCase();
  
  // Direct matches first
  if (productMaterialMappings[trimmedId]) {
    console.log(`Found direct match for ${trimmedId}`);
    return trimmedId;
  }
  
  // Check for keyword matches
  if (trimmedId.includes("bottle") || (trimmedId.includes("bamboo") && !trimmedId.includes("brush") && !trimmedId.includes("tooth"))) {
    console.log("Matched as bamboo water bottle");
    return "bamboo-water-bottle";
  }
  if (trimmedId.includes("toothbrush") || (trimmedId.includes("bamboo") && (trimmedId.includes("brush") || trimmedId.includes("tooth")))) {
    console.log("Matched as bamboo toothbrush");
    return "biodegradable-bamboo-toothbrush";
  }
  if (trimmedId.includes("shirt") || trimmedId.includes("cotton") || trimmedId.includes("tshirt") || trimmedId.includes("t-shirt")) {
    console.log("Matched as organic cotton shirt");
    return "organic-cotton-shirt";
  }
  if (trimmedId.includes("cream") || trimmedId.includes("face")) {
    console.log("Matched as natural face cream");
    return "natural-face-cream";
  }
  if (trimmedId.includes("coffee") || trimmedId.includes("cup")) {
    console.log("Matched as recycled coffee cup");
    return "recycled-coffee-cup";
  }
  if (trimmedId.includes("power") || trimmedId.includes("solar") || trimmedId.includes("bank") || trimmedId.includes("charger")) {
    console.log("Matched as solar power bank");
    return "solar-power-bank-001";
  }
  if (trimmedId.includes("shoes") || trimmedId.includes("footwear") || trimmedId.includes("ocean-plastic")) {
    console.log("Matched as ocean plastic shoes");
    return "recycled-ocean-plastic-shoes";
  }
  if (trimmedId.includes("dress") || trimmedId.includes("fashion") || trimmedId.includes("glam") || trimmedId.includes("party")) {
    console.log("Matched as fast fashion dress");
    return "fast-fashion-dress-001";
  }
  if (trimmedId.includes("camera") || trimmedId.includes("snap") || trimmedId.includes("disposable")) {
    console.log("Matched as disposable camera");
    return "disposable-camera-001";
  }
  if (trimmedId.includes("glass") || trimmedId.includes("sunglass") || trimmedId.includes("trend") || trimmedId.includes("eye")) {
    console.log("Matched as plastic glasses");
    return "plastic-glasses-001";
  }
  if (trimmedId.includes("perfume") || trimmedId.includes("fragrance") || trimmedId.includes("cologne")) {
    console.log("Matched as perfume");
    return "perfume";
  }
  
  // Check for numeric pattern in ID as last resort
  for (const num of ["1", "2", "3", "4", "5"]) {
    if (trimmedId.includes(num)) {
      console.log(`Matched using numeric identifier: ${num}`);
      return num;
    }
  }
  
  // Default fallback
  console.log("No match found, defaulting to bamboo water bottle");
  return "1";
};

export const determineProductName = (
  productType: string, 
  hasDetectedPlastic: boolean,
  productId: string
): string => {
  if (hasDetectedPlastic && !productId.includes("solar") && !productId.includes("power")) {
    return "Plastic Product";
  }
  
  const normalizedType = productType.trim().toLowerCase();
  
  // Check for direct match in product descriptions first
  if (productDescriptions[normalizedType]) {
    return productDescriptions[normalizedType];
  }
  
  // Fallback to keyword matching in product ID 
  const normalizedId = productId.trim().toLowerCase();
  
  if (normalizedId.includes("bottle") || (normalizedId.includes("bamboo") && !normalizedId.includes("brush") && !normalizedId.includes("tooth"))) {
    return "Bamboo Water Bottle";
  }
  if (normalizedId.includes("toothbrush") || (normalizedId.includes("bamboo") && (normalizedId.includes("brush") || normalizedId.includes("tooth")))) {
    return "Biodegradable Bamboo Toothbrush";
  }
  if (normalizedId.includes("shirt") || normalizedId.includes("cotton") || normalizedId.includes("tshirt") || normalizedId.includes("t-shirt")) {
    return "Organic Cotton T-shirt";
  }
  if (normalizedId.includes("cream") || normalizedId.includes("face")) {
    return "Natural Face Cream";
  }
  if (normalizedId.includes("coffee") || normalizedId.includes("cup")) {
    return "Recycled Coffee Cup";
  }
  if (normalizedId.includes("power") || normalizedId.includes("solar") || normalizedId.includes("bank") || normalizedId.includes("charger")) {
    return "EcoCharge Solar Power Bank";
  }
  if (normalizedId.includes("shoes") || normalizedId.includes("footwear") || normalizedId.includes("ocean-plastic")) {
    return "Recycled Ocean Plastic Shoes";
  }
  if (normalizedId.includes("dress") || normalizedId.includes("fashion") || normalizedId.includes("glam") || normalizedId.includes("party")) {
    return "FastGlam Party Dress";
  }
  if (normalizedId.includes("camera") || normalizedId.includes("snap") || normalizedId.includes("disposable")) {
    return "SnapQuick Disposable Camera Kit";
  }
  if (normalizedId.includes("glass") || normalizedId.includes("sunglass") || normalizedId.includes("trend") || normalizedId.includes("eye")) {
    return "TrendEye Colorful Sunglasses Set";
  }
  if (normalizedId.includes("perfume") || normalizedId.includes("fragrance") || normalizedId.includes("cologne")) {
    return "Fragrance";
  }
  
  // Last resort fallback
  return "Unknown Product";
};

// Add a utility function to get product images - this will help with the missing solar power bank image
export const getProductImage = (productType: string): string => {
  const normalizedType = productType.trim().toLowerCase();
  
  switch(normalizedType) {
    case "1":
    case "bamboo-water-bottle":
    case "bottle":
    case "water-bottle":
      return "https://images.unsplash.com/photo-1605952224352-e3db8d193cf7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "2":
    case "organic-cotton-shirt":
    case "shirt":
    case "t-shirt":
    case "cotton-shirt":
      return "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "3":
    case "natural-face-cream":
    case "face-cream":
    case "cream":
      return "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "4":
    case "recycled-coffee-cup":
    case "coffee-cup":
    case "cup":
      return "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "5":
    case "solar-power-bank":
    case "solar-power-bank-001":
    case "power-bank":
    case "powerbank":
      return "https://images.unsplash.com/photo-1594131975464-8a26d4ad3f7f?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    case "perfume":
    case "fragrance":
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "fast-fashion-dress-001":
    case "dress":
    case "fashion-dress":
      return "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80";
    case "disposable-camera-001":
    case "camera":
    case "disposable-camera":
      return "https://images.unsplash.com/photo-1554136545-2f288e75dfe6?auto=format&fit=crop&w=800&q=80";
    case "plastic-glasses-001":
    case "glasses":
    case "sunglasses":
      return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80";
    case "biodegradable-bamboo-toothbrush":
    case "toothbrush":
    case "bamboo-toothbrush":
      return "https://images.unsplash.com/photo-1559674398-1e2f98a8f8f3?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    case "recycled-ocean-plastic-shoes":
    case "shoes":
    case "footwear":
      return "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    default:
      console.log(`No image match found for ${normalizedType}, using default image`);
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  }
};
