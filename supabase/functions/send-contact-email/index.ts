import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email:", { name, email, subject });

    const logoUrl = "https://eliteforums.in/logo.png";
    
    const emailHeader = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <img src="${logoUrl}" alt="Elite Forums" style="height: 60px; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
          Elite Forums
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          Empowering Excellence Through Innovation
        </p>
      </div>
    `;

    const emailFooter = `
      <div style="background: #1a1a2e; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <img src="${logoUrl}" alt="Elite Forums" style="height: 40px; margin-bottom: 12px; opacity: 0.9;" />
        <p style="color: #a0a0a0; font-size: 13px; margin: 0 0 8px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          Building Tomorrow's Leaders Today
        </p>
        <div style="border-top: 1px solid #333; margin: 16px 0; padding-top: 16px;">
          <p style="color: #888; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            📞 +91 9322510601 &nbsp;|&nbsp; 📧 admin@eliteforums.in
          </p>
          <p style="color: #666; font-size: 11px; margin: 12px 0 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            © ${new Date().getFullYear()} Elite Forums. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Elite Forums <noreply@eliteforums.in>",
      to: ["admin@eliteforums.in"],
      subject: `🔔 New Inquiry: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${emailHeader}
          
          <div style="padding: 32px 24px; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%); border-radius: 10px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <h2 style="color: #333; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
                📋 Contact Details
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; width: 80px;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #667eea; font-size: 14px; font-weight: 600;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Subject:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${subject}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 24px;">
              <h3 style="color: #333; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                💬 Message
              </h3>
              <p style="color: #555; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>
            
            <div style="margin-top: 24px; padding: 16px; background: #e8f4fd; border-radius: 8px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Reply to ${name}
              </a>
            </div>
          </div>
          
          ${emailFooter}
        </div>
      `,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to the customer
    const customerEmailResponse = await resend.emails.send({
      from: "Elite Forums <noreply@eliteforums.in>",
      to: [email],
      subject: "✨ Thank you for reaching out to Elite Forums!",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${emailHeader}
          
          <div style="padding: 32px 24px; background: #ffffff;">
            <h2 style="color: #333; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">
              Hello ${name}! 👋
            </h2>
            <p style="color: #666; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
              Thank you for getting in touch with Elite Forums. We've received your message and our team will review it shortly.
            </p>
            
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%); border-radius: 10px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                📝 Your Message Summary
              </h3>
              <p style="color: #666; font-size: 13px; margin: 0 0 8px 0;">
                <strong>Subject:</strong> ${subject}
              </p>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; background: #fff; padding: 16px; border-radius: 6px; border: 1px solid #e0e0e0;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 10px; padding: 24px; text-align: center;">
              <p style="color: #333; font-size: 15px; margin: 0 0 8px 0; font-weight: 600;">
                ⏱️ What happens next?
              </p>
              <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.6;">
                Our team typically responds within <strong>24-48 hours</strong>. We appreciate your patience and look forward to connecting with you!
              </p>
            </div>
          </div>
          
          ${emailFooter}
        </div>
      `,
    });

    console.log("Customer confirmation email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
