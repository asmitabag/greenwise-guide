
// Product mappings and utility functions for analysis
export const productMaterialMappings = {
  "1": [ // Bamboo Water Bottle
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
  "2": [ // Organic Cotton T-shirt
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
      percentage: 5, 
      eco_score: 8.0, 
      sustainable: true, 
      details: "Plant-based coloring with low environmental impact",
      carbon_footprint: 0.8,
      water_usage: 60,
      recyclability_rating: 6,
      biodegradability_rating: 8,
      certification_ids: ["cert-4"]
    }
  ],
  "3": [ // Natural Face Cream
    { 
      id: "3-1",
      name: "Aloe Vera Extract", 
      percentage: 40, 
      eco_score: 9.0, 
      sustainable: true, 
      details: "Natural moisturizing ingredient",
      carbon_footprint: 0.3,
      water_usage: 40,
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
      name: "Coconut Oil", 
      percentage: 20, 
      eco_score: 7.0, 
      sustainable: true, 
      details: "Natural oil with multiple skin benefits",
      carbon_footprint: 0.9,
      water_usage: 30,
      recyclability_rating: 8,
      biodegradability_rating: 9,
      certification_ids: ["cert-1", "cert-4"]
    },
    { 
      id: "3-4",
      name: "Natural Preservatives", 
      percentage: 10, 
      eco_score: 6.5, 
      sustainable: true, 
      details: "Plant-derived preservation system",
      carbon_footprint: 1.1,
      water_usage: 10,
      recyclability_rating: 7,
      biodegradability_rating: 8,
      certification_ids: ["cert-3"]
    }
  ],
  "4": [ // Recycled Coffee Cup
    { 
      id: "4-1",
      name: "Recycled Paper", 
      percentage: 85, 
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
      percentage: 10, 
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
  "5": [ // Solar Power Bank
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
      name: "Silicon Solar Panel", 
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
  "perfume": [ // Fragrance
    { 
      id: "perfume-1",
      name: "Alcohol", 
      percentage: 80, 
      eco_score: 5.0, 
      sustainable: false, 
      details: "Main carrier for fragrance compounds",
      carbon_footprint: 2.3,
      water_usage: 85,
      recyclability_rating: 7,
      biodegradability_rating: 8,
      certification_ids: []
    },
    { 
      id: "perfume-2",
      name: "Essential Oils", 
      percentage: 15, 
      eco_score: 7.0, 
      sustainable: true, 
      details: "Natural fragrance compounds from plants",
      carbon_footprint: 3.8,
      water_usage: 120,
      recyclability_rating: 3,
      biodegradability_rating: 4,
      certification_ids: []
    },
    { 
      id: "perfume-3",
      name: "Glass Bottle", 
      percentage: 5, 
      eco_score: 6.5, 
      sustainable: true, 
      details: "Recyclable container material",
      carbon_footprint: 5.1,
      water_usage: 95,
      recyclability_rating: 2,
      biodegradability_rating: 2,
      certification_ids: []
    }
  ],
  "plastic": [ // Generic plastic product
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
  "solar-power-bank": "Solar Power Bank"
};

export const determineProductKey = (id: string): string => {
  // Direct matches
  if (["1", "2", "3", "4", "5", "perfume"].includes(id)) {
    return id;
  }
  
  // Check for product type in the ID
  if (id.includes("bottle") || id.includes("bamboo")) {
    return "1";
  }
  if (id.includes("shirt") || id.includes("cotton") || id.includes("tshirt")) {
    return "2";
  }
  if (id.includes("cream") || id.includes("face")) {
    return "3";
  }
  if (id.includes("coffee") || id.includes("cup")) {
    return "4";
  }
  if (id.includes("power") || id.includes("solar") || id.includes("bank")) {
    return "5";
  }
  if (id.includes("perfume") || id.includes("fragrance") || id.includes("cologne")) {
    return "perfume";
  }
  
  // Check for numeric pattern in ID
  for (const num of ["1", "2", "3", "4", "5"]) {
    if (id.includes(num)) {
      return num;
    }
  }
  
  // Default to perfume if no match is found
  return "perfume";
};

export const determineProductName = (
  productType: string, 
  hasDetectedPlastic: boolean,
  productId: string
): string => {
  if (hasDetectedPlastic) {
    return "Plastic Product";
  }
  
  // Check for direct match in product descriptions
  if (productDescriptions[productType]) {
    return productDescriptions[productType];
  }
  
  // Check for product type in the ID
  if (productId.includes("bottle") || productId.includes("bamboo")) return "Bamboo Water Bottle";
  if (productId.includes("shirt") || productId.includes("cotton")) return "Organic Cotton T-shirt";
  if (productId.includes("cream") || productId.includes("face")) return "Natural Face Cream";
  if (productId.includes("coffee") || productId.includes("cup")) return "Recycled Coffee Cup";
  if (productId.includes("power") || productId.includes("solar")) return "Solar Power Bank";
  if (productId.includes("perfume") || productId.includes("fragrance")) return "Fragrance";
  if (productId.includes("plastic")) return "Plastic Product";
  
  // Default case
  return "Unknown Product";
};

// Add a utility function to get product images - this will help with the missing solar power bank image
export const getProductImage = (productType: string): string => {
  switch(productType) {
    case "1":
    case "bamboo-water-bottle":
      return "https://images.unsplash.com/photo-1605952224352-e3db8d193cf7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "2":
    case "organic-cotton-shirt":
      return "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "3":
    case "natural-face-cream":
      return "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "4":
    case "recycled-coffee-cup":
      return "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "5":
    case "solar-power-bank":
      return "https://images.unsplash.com/photo-1594131975464-8a26d4ad3f7f?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    case "perfume":
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    default:
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  }
};
