import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkMailRequest {
  campaignId: string;
  subject: string;
  body: string;
  recipients: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, subject, body, recipients }: BulkMailRequest = await req.json();

    console.log(`Starting bulk mail campaign ${campaignId} with ${recipients.length} recipients`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Convert body to HTML
    const htmlBody = body
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <img src="https://eliteforums.in/logo.png" alt="Elite Forums" style="height: 50px; margin-bottom: 10px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Elite Forums</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <div style="font-size: 15px; line-height: 1.8; color: #374151;">
                ${htmlBody}
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 5px 0;"><strong style="color: #1a1a2e;">Elite Forums</strong></p>
              <p style="margin: 5px 0;">Vasai-Virar, Maharashtra 401208</p>
              <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #9ca3af;">
                "Empowering Businesses Through Technology & Training"
              </p>
            </div>
          </body>
          </html>
        `;

        await resend.emails.send({
          from: "Elite Forums <contact@eliteforums.in>",
          to: [recipient],
          subject: subject,
          html: emailHtml,
        });

        sentCount++;
        console.log(`Email sent to ${recipient}`);
      } catch (emailError) {
        failedCount++;
        console.error(`Failed to send to ${recipient}:`, emailError);
        errors.push(`${recipient}: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
      }

      // Small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Update campaign status in database
    const { error: updateError } = await supabase
      .from("bulk_mail_campaigns")
      .update({
        status: failedCount === recipients.length ? "failed" : "completed",
        sent_count: sentCount,
        failed_count: failedCount,
        completed_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    if (updateError) {
      console.error("Error updating campaign status:", updateError);
    }

    console.log(`Campaign ${campaignId} completed. Sent: ${sentCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        sentCount,
        failedCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-bulk-mail function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
