
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const body = await req.json();
    const { paymentMethod, amount, orderId } = body;

    // Get the current user's session
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Simulate payment processing
    console.log(`Processing payment of ₹${amount} using ${paymentMethod} for order ${orderId}`);
    
    // Simulate a delay for processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, you would integrate with a payment gateway here
    const isSuccessful = Math.random() > 0.1; // 90% success rate for simulation
    
    if (!isSuccessful) {
      throw new Error('Payment failed');
    }

    // Update the order status in the database
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid', payment_method: paymentMethod })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed successfully',
        transactionId: `TXN${Date.now()}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
