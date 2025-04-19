
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { determineProductKey, productMaterialMappings, productDescriptions, determineProductName } from "../utils/product-utils";

export const useProductAnalysis = (productId: string) => {
  const normalizedProductId = productId.startsWith('fc') ? productId : productId.trim();
  
  // Get detected materials from session storage if available
  const detectedMaterials = sessionStorage.getItem('detectedMaterials') 
    ? JSON.parse(sessionStorage.getItem('detectedMaterials')!) 
    : [];
  
  // Determine product type based on detected materials
  const determineTypeFromMaterials = (materials: string[]) => {
    if (materials.some(m => m.toLowerCase().includes('alcohol') || m.toLowerCase().includes('fragrance'))) {
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
      return "solar-power-bank";
    } else if (materials.some(m => m.toLowerCase().includes('plastic') || m.toLowerCase().includes('polymer'))) {
      return "perfume"; // Default for plastic to ensure we always get a result
    }
    return null;
  };
  
  // First determine product type from the ID, then from materials if needed
  let productType = determineProductKey(normalizedProductId);
  const materialsType = determineTypeFromMaterials(detectedMaterials);
  
  // If we have materials that suggest a different product type, use that instead
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
      
      // First, try to get materials from our predefined mappings based on product type
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
      
      // Last resort: use default materials
      if (hasDetectedPlastic) {
        console.log("Using plastic-based default materials");
        return productMaterialMappings["perfume"]; // Use perfume as a fallback for plastic
      }
      
      // If all else fails, throw an error
      throw new Error("No material data could be found or generated");
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
