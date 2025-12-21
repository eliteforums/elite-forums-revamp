import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOfferLetterRequest {
  candidateName: string;
  candidateEmail: string;
  position: string;
  offerLetter: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidateName, candidateEmail, position, offerLetter }: SendOfferLetterRequest = await req.json();

    console.log("Sending offer letter to:", candidateEmail);

    // Convert markdown-style formatting to HTML
    const htmlContent = offerLetter
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/#{1,3}\s*(.*?)(<br>|$)/g, '<h3 style="margin: 16px 0 8px 0; color: #333;">$1</h3>');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Letter - Elite Forums</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0066cc; padding-bottom: 20px;">
            <h1 style="color: #0066cc; margin: 0; font-size: 28px;">ELITE FORUMS</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Excellence in IT Solutions & Training</p>
          </div>
          
          <!-- Content -->
          <div style="font-size: 15px; line-height: 1.8;">
            ${htmlContent}
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;"><strong>Elite Forums</strong></p>
            <p style="margin: 5px 0;">Shop No. 7, Golden Park Rd, near D Mart, Evershine City</p>
            <p style="margin: 5px 0;">Vasai-Virar, Maharashtra 401208</p>
            <p style="margin: 5px 0;">Phone: +91-XXXXXXXXXX | Email: hr@eliteforums.in</p>
            <p style="margin: 15px 0 5px 0; color: #999;">This is an official offer letter from Elite Forums.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Elite Forums HR <onboarding@resend.dev>",
      to: [candidateEmail],
      subject: `Offer Letter - ${position} Position at Elite Forums`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Also send a copy to HR
    await resend.emails.send({
      from: "Elite Forums System <onboarding@resend.dev>",
      to: ["hr@eliteforums.in"],
      subject: `[Copy] Offer Letter Sent to ${candidateName} - ${position}`,
      html: `
        <h2>Offer Letter Sent</h2>
        <p><strong>Candidate:</strong> ${candidateName}</p>
        <p><strong>Email:</strong> ${candidateEmail}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <hr>
        <h3>Letter Content:</h3>
        ${htmlContent}
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Offer letter sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending offer letter:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
