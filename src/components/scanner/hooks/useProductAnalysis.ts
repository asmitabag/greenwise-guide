
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { determineProductKey, productMaterialMappings, productDescriptions, determineProductName } from "../utils/product-utils";

export const useProductAnalysis = (productId: string) => {
  const normalizedProductId = productId.startsWith('fc') ? productId : productId.trim();
  
  // Get detected materials from session storage if available
  const detectedMaterials = sessionStorage.getItem('detectedMaterials') 
    ? JSON.parse(sessionStorage.getItem('detectedMaterials')!) 
    : [];
  
  // Determine product type based on detected materials and product ID
  const determineTypeFromMaterials = (materials: string[]) => {
    if (materials.some(m => m.toLowerCase().includes('polyester') || m.toLowerCase().includes('sequin'))) {
      return "fast-fashion-dress-001";
    } else if (materials.some(m => m.toLowerCase().includes('camera') || m.toLowerCase().includes('battery'))) {
      return "disposable-camera-001";
    } else if (materials.some(m => m.toLowerCase().includes('acrylic') || m.toLowerCase().includes('sunglass'))) {
      return "plastic-glasses-001";
    } else if (materials.some(m => m.toLowerCase().includes('alcohol') || m.toLowerCase().includes('fragrance'))) {
      return "perfume";
    } else if (materials.some(m => m.toLowerCase().includes('bamboo'))) {
      return "bamboo-water-bottle";
    } else if (materials.some(m => m.toLowerCase().includes('cotton'))) {
      return "organic-cotton-shirt";
    } else if (materials.some(m => m.toLowerCase().includes('cream') || m.toLowerCase().includes('aloe'))) {
      return "natural-face-cream";
    } else if (materials.some(m => m.toLowerCase().includes('paper'))) {
      return "recycled-coffee-cup";
    } else if (materials.some(m => m.toLowerCase().includes('solar') || m.toLowerCase().includes('lithium'))) {
      return "solar-power-bank-001";
    } else if (materials.some(m => m.toLowerCase().includes('plastic') || m.toLowerCase().includes('polymer'))) {
      return "plastic-glasses-001"; // Default for plastic to ensure we always get a result
    }
    return null;
  };
  
  // Check if product ID contains specific product identifiers
  const determineTypeFromId = (id: string) => {
    // Check if ID contains FastGlam party dress identifiers
    if (id.includes("dress") || id.includes("fashion") || id.includes("glam") || id.includes("party")) {
      return "fast-fashion-dress-001";
    }
    
    // Check if ID contains disposable camera identifiers
    if (id.includes("camera") || id.includes("snap") || id.includes("disposable")) {
      return "disposable-camera-001";
    }
    
    // Check if ID contains sunglasses identifiers
    if (id.includes("glass") || id.includes("sunglass") || id.includes("trend") || id.includes("eye")) {
      return "plastic-glasses-001";
    }
    
    return null;
  };
  
  // First determine product type from the ID, then from materials if needed
  let productType = determineProductKey(normalizedProductId);
  
  // If we have a specific product ID match, use that first
  const specificTypeFromId = determineTypeFromId(normalizedProductId);
  if (specificTypeFromId) {
    console.log("Using product type from specific ID match:", specificTypeFromId);
    productType = specificTypeFromId;
  }
  
  // If we still don't have a specific product type or it's "unknown", try materials
  const materialsType = determineTypeFromMaterials(detectedMaterials);
  if (materialsType && (!productType || productType === "unknown")) {
    console.log("Using product type from detected materials:", materialsType);
    productType = materialsType;
  }
  
  console.log("Final product type for analysis:", productType, "Materials:", detectedMaterials);
  
  const hasDetectedPlastic = detectedMaterials.some((m: string) => 
    m.toLowerCase().includes('plastic'));

  const { data: materials = [], isLoading: materialsLoading, error: materialsError, refetch } = useQuery({
    queryKey: ['material-analysis', normalizedProductId, productType, detectedMaterials],
    queryFn: async () => {
      console.log(`Analyzing materials for product ${normalizedProductId}, type: ${productType}, with detected materials:`, detectedMaterials);
      
      // First, check for specific product types by ID
      if (normalizedProductId.includes("fast") || normalizedProductId.includes("dress") || normalizedProductId.includes("fashion")) {
        console.log("Using FastGlam Party Dress materials");
        return productMaterialMappings["fast-fashion-dress-001"];
      }
      
      if (normalizedProductId.includes("camera") || normalizedProductId.includes("disposable") || normalizedProductId.includes("snap")) {
        console.log("Using Disposable Camera materials");
        return productMaterialMappings["disposable-camera-001"];
      }
      
      if (normalizedProductId.includes("glass") || normalizedProductId.includes("trend") || normalizedProductId.includes("eye")) {
        console.log("Using Sunglasses materials");
        return productMaterialMappings["plastic-glasses-001"];
      }
      
      if (normalizedProductId === "solar-power-bank-001") {
        console.log("Using Solar Power Bank materials by exact ID match");
        return productMaterialMappings["solar-power-bank-001"];
      }
      
      // Try to get materials from our predefined mappings based on product type
      if (productType && productMaterialMappings[productType]) {
        console.log(`Using predefined materials for ${productType}`);
        return productMaterialMappings[productType];
      }
      
      // If no type determined yet but we have detected materials, try to infer type
      if (detectedMaterials.length > 0) {
        const inferredType = determineTypeFromMaterials(detectedMaterials);
        if (inferredType && productMaterialMappings[inferredType]) {
          console.log(`Inferred type from materials: ${inferredType}`);
          return productMaterialMappings[inferredType];
        }
      }
      
      // Try database lookup
      try {
        const { data, error } = await supabase
          .from('material_analysis')
          .select('*')
          .eq('product_id', normalizedProductId);
        
        if (error) {
          console.error("Error fetching materials:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Found materials in database:", data);
          return data;
        }
      } catch (err) {
        console.error("Database lookup failed:", err);
      }
      
      // Last resort: use default materials based on product ID keywords
      if (normalizedProductId.includes("bottle") || normalizedProductId.includes("bamboo")) {
        console.log("Using bamboo water bottle materials based on ID keywords");
        return productMaterialMappings["1"];
      }
      
      if (normalizedProductId.includes("shirt") || normalizedProductId.includes("cotton")) {
        console.log("Using organic cotton t-shirt materials based on ID keywords");
        return productMaterialMappings["2"];
      }
      
      if (normalizedProductId.includes("cream") || normalizedProductId.includes("face")) {
        console.log("Using natural face cream materials based on ID keywords");
        return productMaterialMappings["3"];
      }
      
      if (normalizedProductId.includes("coffee") || normalizedProductId.includes("cup")) {
        console.log("Using recycled coffee cup materials based on ID keywords");
        return productMaterialMappings["4"];
      }
      
      if (normalizedProductId.includes("solar") || normalizedProductId.includes("power") || normalizedProductId.includes("bank")) {
        console.log("Using solar power bank materials based on ID keywords");
        return productMaterialMappings["solar-power-bank-001"];
      }
      
      // Generic material based on what was detected
      if (hasDetectedPlastic) {
        console.log("Using plastic-based default materials");
        return productMaterialMappings["plastic-glasses-001"]; // Use plastic glasses as fallback for plastic
      }
      
      // If all else fails, use perfume as default
      console.log("Using perfume as default materials");
      return productMaterialMappings["perfume"];
    },
    refetchOnWindowFocus: false,
    retry: 1,
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

  // Get an appropriate product name based on the determined type and materials
  const productName = determineProductName(productType, hasDetectedPlastic, normalizedProductId);

  return {
    materials,
    certifications,
    materialsLoading,
    certificationsLoading,
    materialsError,
    productName,
    productType,
    refetch
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
