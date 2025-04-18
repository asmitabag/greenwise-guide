// Product mappings and utility functions for analysis
export const productMaterialMappings = {
  "1": [ // Bamboo Water Bottle
    { name: "Bamboo", percentage: 70, eco_score: 8.5, sustainable: true, details: "Sustainable, fast-growing natural material" },
    { name: "Stainless Steel", percentage: 25, eco_score: 6.0, sustainable: true, details: "Durable and recyclable metal components" },
    { name: "Silicone", percentage: 5, eco_score: 5.0, sustainable: false, details: "Used for seals and gaskets" }
  ],
  "2": [ // Organic Cotton T-shirt
    { name: "Organic Cotton", percentage: 95, eco_score: 7.5, sustainable: true, details: "Grown without synthetic pesticides or fertilizers" },
    { name: "Natural Dyes", percentage: 5, eco_score: 8.0, sustainable: true, details: "Plant-based coloring with low environmental impact" }
  ],
  "3": [ // Natural Face Cream
    { name: "Aloe Vera Extract", percentage: 40, eco_score: 9.0, sustainable: true, details: "Natural moisturizing ingredient" },
    { name: "Shea Butter", percentage: 30, eco_score: 8.5, sustainable: true, details: "Natural plant-based emollient" },
    { name: "Coconut Oil", percentage: 20, eco_score: 7.0, sustainable: true, details: "Natural oil with multiple skin benefits" },
    { name: "Natural Preservatives", percentage: 10, eco_score: 6.5, sustainable: true, details: "Plant-derived preservation system" }
  ],
  "4": [ // Recycled Coffee Cup
    { name: "Recycled Paper", percentage: 85, eco_score: 7.0, sustainable: true, details: "Made from post-consumer waste paper" },
    { name: "Plant-based Lining", percentage: 10, eco_score: 8.0, sustainable: true, details: "Biodegradable alternative to plastic lining" },
    { name: "Vegetable Inks", percentage: 5, eco_score: 8.5, sustainable: true, details: "Non-toxic printing materials" }
  ],
  "5": [ // Solar Power Bank
    { name: "Recycled Aluminum", percentage: 40, eco_score: 7.0, sustainable: true, details: "Durable casing made from post-consumer aluminum" },
    { name: "Silicon Solar Panel", percentage: 20, eco_score: 6.0, sustainable: true, details: "Renewable energy technology with medium production impact" },
    { name: "Lithium-ion Battery", percentage: 35, eco_score: 4.0, sustainable: false, details: "Energy storage with significant environmental concerns" },
    { name: "Recycled Plastic", percentage: 5, eco_score: 5.0, sustainable: true, details: "Used for smaller components" }
  ],
  "perfume": [ // Fragrance
    { name: "Alcohol", percentage: 80, eco_score: 5.0, sustainable: false, details: "Main carrier for fragrance compounds" },
    { name: "Essential Oils", percentage: 15, eco_score: 7.0, sustainable: true, details: "Natural fragrance compounds from plants" },
    { name: "Glass Bottle", percentage: 5, eco_score: 6.5, sustainable: true, details: "Recyclable container material" }
  ],
  "plastic": [ // Generic plastic product
    { name: "Plastic", percentage: 100, eco_score: 2.0, sustainable: false, details: "Non-biodegradable petroleum-based material with high environmental impact" }
  ]
};

export const productDescriptions = {
  "1": "Bamboo Water Bottle",
  "2": "Organic Cotton T-shirt",
  "3": "Natural Face Cream",
  "4": "Recycled Coffee Cup",
  "5": "Solar Power Bank",
  "perfume": "Fragrance",
  "plastic": "Plastic Product"
};

export const determineProductKey = (id: string): string => {
  if (["1", "2", "3", "4", "5", "perfume"].includes(id)) {
    return id;
  }
  
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
  
  for (const num of ["1", "2", "3", "4", "5"]) {
    if (id.includes(num)) {
      return num;
    }
  }
  
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
  
  if (productDescriptions[productType]) {
    return productDescriptions[productType];
  }
  
  if (productId.includes("bottle") || productId.includes("bamboo")) return "Bamboo Water Bottle";
  if (productId.includes("shirt") || productId.includes("cotton")) return "Organic Cotton T-shirt";
  if (productId.includes("cream") || productId.includes("face")) return "Natural Face Cream";
  if (productId.includes("coffee") || productId.includes("cup")) return "Recycled Coffee Cup";
  if (productId.includes("power") || productId.includes("solar")) return "Solar Power Bank";
  if (productId.includes("perfume") || productId.includes("fragrance")) return "Fragrance";
  if (productId.includes("plastic")) return "Plastic Product";
  
  return "Unknown Product";
};
