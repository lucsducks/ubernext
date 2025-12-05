import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TRIP-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const { tripId, amount, userName, userEmail, driverName, description, commissionPercentage = 15 } = await req.json();
    
    logStep("Payment request received", { tripId, amount, userName, userEmail });

    if (!amount || !userName) {
      throw new Error("Missing required fields: amount, userName");
    }

    // Calculate commission
    const commissionAmount = Math.round((amount * commissionPercentage) / 100);
    const driverAmount = amount - commissionAmount;

    logStep("Commission calculated", { amount, commissionAmount, driverAmount, commissionPercentage });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing customer
    let customerId;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Viaje UberNext - ${description || 'Servicio de transporte'}`,
              description: driverName ? `Conductor: ${driverName}` : undefined,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/pagos?success=true&trip_id=${tripId || 'direct'}`,
      cancel_url: `${req.headers.get("origin")}/pagos?canceled=true`,
      metadata: {
        trip_id: tripId || 'direct',
        user_name: userName,
        driver_name: driverName || '',
        commission_amount: commissionAmount.toString(),
        driver_amount: driverAmount.toString(),
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Create payment record in database
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from("trip_payments")
      .insert({
        trip_id: tripId || null,
        stripe_payment_intent_id: session.payment_intent as string || null,
        amount,
        commission_amount: commissionAmount,
        driver_amount: driverAmount,
        user_name: userName,
        user_email: userEmail,
        driver_name: driverName,
        description: description || 'Pago de viaje',
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      logStep("Error creating payment record", { error: paymentError });
    } else {
      logStep("Payment record created", { paymentId: paymentData.id });
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id,
      paymentId: paymentData?.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
