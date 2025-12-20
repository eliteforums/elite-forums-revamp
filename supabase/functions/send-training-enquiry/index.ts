import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TrainingEnquiryRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  trainingInterest: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, trainingInterest, message }: TrainingEnquiryRequest = await req.json();

    console.log("Sending training enquiry email:", { name, email, phone, company, trainingInterest });

    const logoUrl = "https://eliteforums.in/logo.png";

    const emailHeader = `
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%); padding: 40px 20px; text-align: center;">
        <img src="${logoUrl}" alt="Elite Forums Campus" style="height: 50px; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 24px; font-weight: 700;">
          Elite Forums Campus
        </h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 13px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          Corporate Training & Professional Development
        </p>
      </div>
    `;

    const emailFooter = `
      <div style="background: #0d2137; padding: 30px 20px; text-align: center;">
        <img src="${logoUrl}" alt="Elite Forums" style="height: 35px; margin-bottom: 12px; opacity: 0.9;" />
        <p style="color: #7a9cc6; font-size: 12px; margin: 0 0 12px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          Upskilling Professionals Since 2019
        </p>
        <div style="border-top: 1px solid #1e3a5f; margin: 16px 0; padding-top: 16px;">
          <p style="color: #5a7a9a; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            📞 +91 9322510601 &nbsp;|&nbsp; 📧 edu@eliteforums.in
          </p>
          <p style="color: #3a5a7a; font-size: 11px; margin: 12px 0 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            © ${new Date().getFullYear()} Elite Forums Campus. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Elite Forums Campus <edu@eliteforums.in>",
      to: ["edu@eliteforums.in"],
      subject: `🎓 New Training Enquiry: ${trainingInterest}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f4f8; border-radius: 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          ${emailHeader}
          
          <div style="padding: 32px 24px; background: #ffffff;">
            <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #1e3a5f;">
              <h2 style="color: #1e3a5f; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                📋 Enquiry Details
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 120px; border-bottom: 1px solid #e2e8f0;">Name:</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Email:</td>
                  <td style="padding: 10px 0; color: #1e3a5f; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    <a href="mailto:${email}" style="color: #1e3a5f; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Phone:</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    <a href="tel:${phone}" style="color: #1e3a5f; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Company:</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${company || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Program Interest:</td>
                  <td style="padding: 10px 0; font-size: 14px;">
                    <span style="background: linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%); color: #fff; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 13px;">
                      ${trainingInterest}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h3 style="color: #1e3a5f; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                💬 Additional Message
              </h3>
              <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
                ${message ? message.replace(/\n/g, '<br>') : 'No additional message provided.'}
              </p>
            </div>
            
            <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px; text-align: center;">
              <a href="mailto:${email}?subject=Re: Training Enquiry - ${trainingInterest}" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%); color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Reply to ${name}
              </a>
            </div>
          </div>
          
          ${emailFooter}
        </div>
      `,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to the enquirer
    const customerEmailResponse = await resend.emails.send({
      from: "Elite Forums Campus <edu@eliteforums.in>",
      to: [email],
      subject: "🎓 Thank you for your Training Enquiry - Elite Forums Campus",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f4f8; border-radius: 0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          ${emailHeader}
          
          <div style="padding: 32px 24px; background: #ffffff;">
            <h2 style="color: #1e3a5f; margin: 0 0 8px 0; font-size: 22px; font-weight: 700;">
              Dear ${name},
            </h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 16px 0 24px 0;">
              Thank you for your interest in our <strong>${trainingInterest}</strong> training program. 
              We're excited to help you or your team upskill with industry-relevant knowledge.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #1e3a5f;">
              <h3 style="color: #1e3a5f; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                📝 Your Enquiry Summary
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 120px;">Program:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${trainingInterest}</td>
                </tr>
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Company:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${company}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1e3a5f; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                ⏱️ What Happens Next?
              </h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="width: 28px; height: 28px; background: #1e3a5f; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0;">1</div>
                  <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">Our training coordinator will review your requirements</p>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="width: 28px; height: 28px; background: #1e3a5f; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0;">2</div>
                  <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">You'll receive a call within <strong>24-48 hours</strong></p>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="width: 28px; height: 28px; background: #1e3a5f; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0;">3</div>
                  <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">We'll schedule a consultation to discuss your training needs</p>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #1e3a5f15 0%, #0d213715 100%); border-radius: 8px; padding: 20px; text-align: center;">
              <p style="color: #1e3a5f; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">
                Have questions? Reach out directly:
              </p>
              <p style="color: #475569; font-size: 14px; margin: 0;">
                📧 edu@eliteforums.in &nbsp;|&nbsp; 📞 +91 9322510601
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
        message: "Training enquiry emails sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-training-enquiry function:", error);
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
