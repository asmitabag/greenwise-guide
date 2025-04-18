
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { determineProductKey, productMaterialMappings, productDescriptions } from "../utils/product-utils";

// Helper function to determine product name based on detected materials
const determineProductName = (productType: string, hasPlastic: boolean, productId: string): string => {
  // First check if product has plastic in detected materials
  if (hasPlastic) {
    return "Plastic Product";
  }
  
  // Check for specific product types
  switch (productType) {
    case "bamboo-water-bottle":
      return "Bamboo Water Bottle";
    case "organic-cotton-shirt":
      return "Organic Cotton T-Shirt";
    case "natural-face-cream":
      return "Natural Face Cream";
    case "recycled-coffee-cup":
      return "Recycled Coffee Cup";
    case "solar-power-bank":
      return "Solar Power Bank";
    case "perfume":
      return "Fragrance Bottle";
    default:
      // If no specific type can be determined, make a generic name based on materials
      return productId.includes('plastic') ? "Plastic Product" : 
             productId.includes('glass') ? "Glass Container" :
             productId.includes('paper') ? "Paper Product" :
             productId.includes('metal') ? "Metal Object" :
             productId.includes('wood') ? "Wooden Item" : "Scanned Product";
  }
};

export const useProductAnalysis = (productId: string) => {
  const normalizedProductId = productId.startsWith('fc') ? productId : productId.trim();
  
  // Get detected materials from session storage if available
  const detectedMaterials = sessionStorage.getItem('detectedMaterials') 
    ? JSON.parse(sessionStorage.getItem('detectedMaterials')!) 
    : [];
  
  // Determine if plastic is detected in materials
  const hasDetectedPlastic = detectedMaterials.some((m: string) => 
    m.toLowerCase().includes('plastic') || m.toLowerCase().includes('polymer'));
    
  // Determine product type based on detected materials first, then fallback to ID
  let productType = '';
  
  // Try to determine product type from detected materials first
  if (hasDetectedPlastic || detectedMaterials.some((m: string) => m.toLowerCase().includes('synthetic'))) {
    productType = 'plastic-product';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('glass'))) {
    productType = 'glass-container';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('bamboo'))) {
    productType = 'bamboo-water-bottle';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('cotton'))) {
    productType = 'organic-cotton-shirt';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('aloe') || m.toLowerCase().includes('cream'))) {
    productType = 'natural-face-cream';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('paper'))) {
    productType = 'recycled-coffee-cup';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('solar') || m.toLowerCase().includes('lithium'))) {
    productType = 'solar-power-bank';
  } else if (detectedMaterials.some((m: string) => m.toLowerCase().includes('alcohol') || m.toLowerCase().includes('fragrance'))) {
    productType = 'perfume';
  } else {
    // If no materials help determine type, use product ID
    productType = determineProductKey(normalizedProductId);
  }
  
  console.log("Determined product type from materials:", productType);
  console.log("Detected materials:", detectedMaterials);

  const { data: materials = [], isLoading: materialsLoading, error: materialsError } = useQuery({
    queryKey: ['material-analysis', normalizedProductId, productType, detectedMaterials],
    queryFn: async () => {
      console.log(`Checking materials for product ${normalizedProductId}, determined type: ${productType}`);
      
      // Check if this is a plastic product (custom logic for plastic)
      if (hasDetectedPlastic && productType === 'plastic-product') {
        console.log("Creating custom plastic product materials");
        return [
          { 
            id: "plastic-1", 
            name: "Plastic (Polymer)", 
            percentage: 85, 
            eco_score: 3, 
            sustainable: false,
            details: "Synthetic polymer material with long degradation timeline"
          },
          { 
            id: "plastic-2", 
            name: "Additives & Colorants", 
            percentage: 12, 
            eco_score: 4, 
            sustainable: false,
            details: "Chemical compounds added for durability and appearance"
          },
          { 
            id: "plastic-3", 
            name: "Other Materials", 
            percentage: 3, 
            eco_score: 5, 
            sustainable: false,
            details: "Various binding agents and processing chemicals"
          }
        ];
      }
      
      if (productMaterialMappings[productType]) {
        console.log(`Using predefined materials for product type ${productType}`);
        return productMaterialMappings[productType];
      }
      
      // If product type isn't matched to predefined mappings,
      // try to fetch from database
      const { data, error } = await supabase
        .from('material_analysis')
        .select('*')
        .eq('product_id', normalizedProductId);
      
      if (error) {
        console.error("Error fetching materials:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        // If no data in database, check if product ID contains any known type
        for (const [key, value] of Object.entries(productMaterialMappings)) {
          if (normalizedProductId.toLowerCase().includes(key.toLowerCase())) {
            return value;
          }
        }
        
        // Default to perfume if no other match found
        return productMaterialMappings["perfume"];
      }
      
      return data;
    },
  });

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('material_certifications')
          .select('*');
        
        if (error) throw error;
        return data || defaultCertifications;
      } catch (error) {
        console.error("Error fetching certifications:", error);
        return defaultCertifications;
      }
    },
  });

  const productName = determineProductName(productType, hasDetectedPlastic, normalizedProductId);

  return {
    materials,
    certifications,
    materialsLoading,
    certificationsLoading,
    materialsError,
    productName,
    productType,
    detectedMaterials
  };
};

// Predefined certifications (moved from the component)
const defaultCertifications = [
  {
    id: "cert-1",
    name: "Eco-Certified",
    issuing_body: "Global Sustainability Council",
    description: "Products made with environmentally responsible practices"
  },
  {
    id: "cert-2",
    name: "Recycled Content",
    issuing_body: "Circular Economy Association",
    description: "Contains verified recycled materials"
  },
  {
    id: "cert-3",
    name: "Biodegradable",
    issuing_body: "Environmental Standards Organization",
    description: "Naturally breaks down with minimal environmental impact"
  },
  {
    id: "cert-4",
    name: "Organic",
    issuing_body: "Organic Materials Council",
    description: "Contains organically grown materials free from synthetic chemicals"
  }
];
