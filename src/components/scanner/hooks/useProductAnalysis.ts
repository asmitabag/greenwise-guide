
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { determineProductKey, productMaterialMappings, productDescriptions } from "../utils/product-utils";

export const useProductAnalysis = (productId: string) => {
  const normalizedProductId = productId.startsWith('fc') ? productId : productId.trim();
  const productType = determineProductKey(normalizedProductId);
  const hasDetectedPlastic = false; // This should be determined from session storage

  const { data: materials = [], isLoading: materialsLoading, error: materialsError } = useQuery({
    queryKey: ['material-analysis', normalizedProductId],
    queryFn: async () => {
      console.log(`Checking materials for product ${normalizedProductId}, determined type: ${productType}`);
      
      if (predefinedMaterials[productType]) {
        console.log(`Using predefined materials for product type ${productType}`);
        return predefinedMaterials[productType];
      }
      
      const { data, error } = await supabase
        .from('material_analysis')
        .select('*')
        .eq('product_id', normalizedProductId);
      
      if (error) {
        console.error("Error fetching materials:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        for (const [key, value] of Object.entries(predefinedMaterials)) {
          if (normalizedProductId.toLowerCase().includes(key.toLowerCase())) {
            return value;
          }
        }
        return predefinedMaterials["perfume"];
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
    productType
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

const predefinedMaterials = productMaterialMappings;
