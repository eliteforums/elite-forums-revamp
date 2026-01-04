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
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 0; background-color: #f8fafc;">
            <!-- Header with gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b5b95 100%); padding: 40px 30px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <img src="https://oyiisjfrcvyuflrrmqhq.supabase.co/storage/v1/object/public/assets/logo.png" alt="Elite Forums" style="height: 55px; margin-bottom: 12px;" onerror="this.style.display='none'">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Elite Forums</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 13px; letter-spacing: 1px;">Empowering Excellence Through Innovation</p>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 40px 35px;">
              <div style="font-size: 15px; line-height: 1.9; color: #374151;">
                ${htmlBody}
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #1a1a2e; padding: 30px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <p style="color: #e2e8f0; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Elite Forums</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 16px 0;">Shop No. 7, Golden Park Rd, Evershine City<br>Vasai-Virar, Maharashtra 401208</p>
                    <div style="border-top: 1px solid #334155; padding-top: 16px; margin-top: 8px;">
                      <p style="color: #64748b; font-size: 12px; margin: 0;">📞 +91 9322510601 &nbsp;|&nbsp; 📧 hello@eliteforums.in</p>
                    </div>
                    <p style="color: #475569; font-size: 11px; margin: 16px 0 0 0; font-style: italic;">
                      "Empowering Businesses Through Technology & Training"
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </body>
          </html>
        `;

        await resend.emails.send({
          from: "Elite Forums <hello@eliteforums.in>",
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
