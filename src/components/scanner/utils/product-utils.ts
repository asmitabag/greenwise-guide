
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
  "fast-fashion-dress-001": [ // FastGlam Party Dress
    { 
      id: "fd-1",
      name: "Polyester", 
      percentage: 75, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Synthetic petroleum-based fabric with high environmental impact",
      carbon_footprint: 6.8,
      water_usage: 90,
      recyclability_rating: 4,
      biodegradability_rating: 1,
      certification_ids: []
    },
    { 
      id: "fd-2",
      name: "Plastic Sequins", 
      percentage: 15, 
      eco_score: 1.0, 
      sustainable: false, 
      details: "Non-biodegradable microplastics that contribute to pollution",
      carbon_footprint: 8.2,
      water_usage: 110,
      recyclability_rating: 1,
      biodegradability_rating: 0,
      certification_ids: []
    },
    { 
      id: "fd-3",
      name: "Synthetic Fiber", 
      percentage: 10, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Petroleum-based fibers that shed microplastics during washing",
      carbon_footprint: 5.9,
      water_usage: 85,
      recyclability_rating: 3,
      biodegradability_rating: 1,
      certification_ids: []
    }
  ],
  "disposable-camera-001": [ // SnapQuick Disposable Camera
    { 
      id: "dc-1",
      name: "Plastic Housing", 
      percentage: 60, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Single-use plastic body designed for disposal after use",
      carbon_footprint: 7.3,
      water_usage: 95,
      recyclability_rating: 2,
      biodegradability_rating: 1,
      certification_ids: []
    },
    { 
      id: "dc-2",
      name: "Electronic Components", 
      percentage: 20, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Circuit boards and flash mechanism containing heavy metals",
      carbon_footprint: 9.7,
      water_usage: 130,
      recyclability_rating: 2,
      biodegradability_rating: 0,
      certification_ids: []
    },
    { 
      id: "dc-3",
      name: "Batteries", 
      percentage: 10, 
      eco_score: 1.0, 
      sustainable: false, 
      details: "Contains toxic chemicals and heavy metals requiring special disposal",
      carbon_footprint: 12.4,
      water_usage: 180,
      recyclability_rating: 3,
      biodegradability_rating: 0,
      certification_ids: []
    },
    { 
      id: "dc-4",
      name: "Photographic Chemicals", 
      percentage: 10, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Film processing chemicals harmful to aquatic environments",
      carbon_footprint: 5.8,
      water_usage: 160,
      recyclability_rating: 1,
      biodegradability_rating: 2,
      certification_ids: []
    }
  ],
  "plastic-glasses-001": [ // TrendEye Colorful Sunglasses
    { 
      id: "pg-1",
      name: "Acrylic Plastic", 
      percentage: 85, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Petroleum-based plastic with high environmental footprint",
      carbon_footprint: 5.8,
      water_usage: 75,
      recyclability_rating: 3,
      biodegradability_rating: 1,
      certification_ids: []
    },
    { 
      id: "pg-2",
      name: "Metal Hinges", 
      percentage: 5, 
      eco_score: 4.0, 
      sustainable: false, 
      details: "Small metal components with medium recyclability",
      carbon_footprint: 3.2,
      water_usage: 60,
      recyclability_rating: 7,
      biodegradability_rating: 0,
      certification_ids: []
    },
    { 
      id: "pg-3",
      name: "Synthetic Dyes", 
      percentage: 10, 
      eco_score: 2.0, 
      sustainable: false, 
      details: "Chemical colorants with potential water pollution impact",
      carbon_footprint: 4.1,
      water_usage: 90,
      recyclability_rating: 1,
      biodegradability_rating: 2,
      certification_ids: []
    }
  ],
  "solar-power-bank-001": [ // EcoCharge Solar Power Bank
    { 
      id: "spb-1",
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
      id: "spb-2",
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
      id: "spb-3",
      name: "Lithium-ion Battery", 
      percentage: 35, 
      eco_score: 4.0, 
      sustainable: false, 
      details: "Energy storage with significant mining impact",
      carbon_footprint: 12.5,
      water_usage: 200,
      recyclability_rating: 4,
      biodegradability_rating: 0,
      certification_ids: []
    },
    { 
      id: "spb-4",
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
  "solar-power-bank": "Solar Power Bank",
  "fast-fashion-dress-001": "FastGlam Party Dress",
  "disposable-camera-001": "SnapQuick Disposable Camera Kit",
  "plastic-glasses-001": "TrendEye Colorful Sunglasses Set",
  "solar-power-bank-001": "EcoCharge Solar Power Bank"
};

export const determineProductKey = (id: string): string => {
  // Direct matches
  if (["1", "2", "3", "4", "5", "perfume", "fast-fashion-dress-001", "disposable-camera-001", "plastic-glasses-001", "solar-power-bank-001"].includes(id)) {
    return id;
  }
  
  // Check for FastGlam party dress
  if (id.includes("dress") || id.includes("fashion") || id.includes("glam") || id.includes("party")) {
    return "fast-fashion-dress-001";
  }
  
  // Check for disposable camera
  if (id.includes("camera") || id.includes("snap") || id.includes("disposable")) {
    return "disposable-camera-001";
  }
  
  // Check for sunglasses
  if (id.includes("glass") || id.includes("sunglass") || id.includes("trend") || id.includes("eye")) {
    return "plastic-glasses-001";
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
    return "solar-power-bank-001";
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
  if (hasDetectedPlastic && !productId.includes("solar") && !productId.includes("power")) {
    return "Plastic Product";
  }
  
  // Check for direct match in product descriptions
  if (productDescriptions[productType]) {
    return productDescriptions[productType];
  }
  
  // Check for specific products first
  if (productId.includes("dress") || productId.includes("fashion") || productId.includes("glam") || productId.includes("party")) {
    return "FastGlam Party Dress";
  }
  if (productId.includes("camera") || productId.includes("snap") || productId.includes("disposable")) {
    return "SnapQuick Disposable Camera Kit";
  }
  if (productId.includes("glass") || productId.includes("sunglass") || productId.includes("trend") || productId.includes("eye")) {
    return "TrendEye Colorful Sunglasses Set";
  }
  
  // Check for product type in the ID
  if (productId.includes("bottle") || productId.includes("bamboo")) return "Bamboo Water Bottle";
  if (productId.includes("shirt") || productId.includes("cotton")) return "Organic Cotton T-shirt";
  if (productId.includes("cream") || productId.includes("face")) return "Natural Face Cream";
  if (productId.includes("coffee") || productId.includes("cup")) return "Recycled Coffee Cup";
  if (productId.includes("power") || productId.includes("solar")) return "EcoCharge Solar Power Bank";
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
    case "solar-power-bank-001":
      return "https://images.unsplash.com/photo-1594131975464-8a26d4ad3f7f?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3";
    case "perfume":
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    case "fast-fashion-dress-001":
      return "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80";
    case "disposable-camera-001":
      return "https://images.unsplash.com/photo-1554136545-2f288e75dfe6?auto=format&fit=crop&w=800&q=80";
    case "plastic-glasses-001":
      return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80";
    default:
      return "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  }
};
