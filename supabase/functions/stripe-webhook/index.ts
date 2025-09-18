// supabase/functions/stripe-webhook/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("URL_SUPABASE") ?? Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY_SUPABASE") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: Request): Promise<Response> {
  console.log("Webhook recebido:", req.method);
  
  if (req.method !== "POST") {
    return new Response("Invalid method", { status: 400 });
  }

  try {
    const body = await req.json();
    console.log("Event type:", body.type);
    
    if (body.type === "checkout.session.completed") {
      const session = body.data.object;
      const email = session.customer_details?.email ?? session.customer_email;
      
      console.log("Processando checkout para email:", email);
      
      const { error } = await supabaseAdmin
        .from("subscribers")
        .upsert({
          email: email,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: "active",
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Erro ao salvar subscriber:", error);
        return new Response("Database error", { status: 500 });
      }
      
      console.log("Subscriber salvo com sucesso!");
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return new Response("Webhook error", { status: 500 });
  }
}

Deno.serve(handler);