
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { productId } = await req.json()

    // Fetch product and verification data
    const { data: request, error: requestError } = await supabase
      .from('product_verification_requests')
      .select(`
        *,
        products (*)
      `)
      .eq('product_id', productId)
      .single()

    if (requestError) throw requestError

    // Perform automated checks
    const verificationChecks = {
      brandVerified: await verifyBrand(request.verification_data.brand_verification),
      marketExists: await checkMarketExistence(request.verification_data.market_existence_proof),
      certificationValid: request.verification_data.product_certification 
        ? await validateCertification(request.verification_data.product_certification)
        : true
    }

    // Update verification status based on checks
    const status = Object.values(verificationChecks).every(check => check) 
      ? 'approved' 
      : 'needs_review'

    const { error: updateError } = await supabase
      .from('product_verification_requests')
      .update({
        status,
        reviewer_notes: JSON.stringify(verificationChecks)
      })
      .eq('product_id', productId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ status, checks: verificationChecks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

// Verify brand existence and authenticity
async function verifyBrand(brandUrl: string): Promise<boolean> {
  try {
    const response = await fetch(brandUrl)
    return response.ok
  } catch {
    return false
  }
}

// Check if product exists in major marketplaces
async function checkMarketExistence(marketUrl: string): Promise<boolean> {
  try {
    const response = await fetch(marketUrl)
    return response.ok
  } catch {
    return false
  }
}

// Validate product certification if provided
async function validateCertification(certificationUrl: string): Promise<boolean> {
  try {
    const response = await fetch(certificationUrl)
    return response.ok
  } catch {
    return false
  }
}
