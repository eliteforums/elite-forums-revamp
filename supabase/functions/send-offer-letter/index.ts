import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOfferLetterRequest {
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  salary: string;
  joiningDate: string;
  location: string;
  offerLetter: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please contact administrator." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    const { 
      candidateName, 
      candidateEmail, 
      position, 
      department,
      salary,
      joiningDate,
      location,
      offerLetter 
    }: SendOfferLetterRequest = await req.json();

    console.log("Processing offer letter for:", candidateName, "to:", candidateEmail);

    // Validate required fields
    if (!candidateName || !candidateEmail || !offerLetter) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: candidateName, candidateEmail, or offerLetter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert markdown-style formatting to HTML
    const htmlContent = offerLetter
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/#{1,3}\s*(.*?)(<br>|$)/g, '<h3 style="margin: 16px 0 8px 0; color: #1a1a2e; font-size: 16px; font-weight: 600;">$1</h3>');

    const formattedDate = joiningDate 
      ? new Date(joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'To be confirmed';

    // Beautiful HTML email template with Elite Forums branding
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Letter - Elite Forums</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <img src="https://eliteforums.in/logo.png" alt="Elite Forums Logo" style="height: 50px; margin-bottom: 12px;" onerror="this.style.display='none'">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ELITE FORUMS</h1>
          <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 13px; letter-spacing: 2px;">EXCELLENCE IN IT SOLUTIONS & TRAINING</p>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Offer Banner -->
          <div style="background: linear-gradient(90deg, #e94560 0%, #f97316 100%); color: white; padding: 20px 24px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 700;">🎉 OFFER LETTER</h2>
            <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 15px;">Position: <strong>${position}</strong></p>
            ${department ? `<p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Department: ${department}</p>` : ''}
          </div>
          
          <!-- Quick Info Box -->
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #e94560;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">📅 Joining Date</td>
                <td style="padding: 8px 0; color: #1a1a2e; font-weight: 600; text-align: right;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">💰 Annual CTC</td>
                <td style="padding: 8px 0; color: #1a1a2e; font-weight: 600; text-align: right;">${salary || 'As discussed'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">📍 Location</td>
                <td style="padding: 8px 0; color: #1a1a2e; font-weight: 600; text-align: right;">${location || 'Vasai, Maharashtra'}</td>
              </tr>
            </table>
          </div>

          <!-- Letter Content -->
          <div style="font-size: 15px; line-height: 1.8; color: #374151;">
            ${htmlContent}
          </div>
          
          <!-- Signature Section -->
          <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <div style="margin-bottom: 20px;">
                <p style="margin: 0; font-weight: 700; color: #1a1a2e; font-size: 14px;">For Elite Forums</p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px;">Authorized Signatory</p>
                <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">HR Department</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-weight: 700; color: #1a1a2e; font-size: 14px;">Candidate Acceptance</p>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 13px;">Signature: ___________________</p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px;">Date: ___________________</p>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div style="margin-top: 30px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #bbf7d0;">
            <p style="margin: 0; color: #166534; font-size: 15px;">
              <strong>Welcome to the Elite Forums family!</strong><br>
              <span style="font-size: 13px;">Please reply to this email to confirm your acceptance.</span>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 24px; color: #6b7280; font-size: 12px;">
          <p style="margin: 8px 0;"><strong style="color: #1a1a2e; font-size: 14px;">Elite Forums</strong></p>
          <p style="margin: 4px 0;">Shop No. 7, Golden Park Rd, near D Mart, Evershine City</p>
          <p style="margin: 4px 0;">Vasai-Virar, Maharashtra 401208, India</p>
          <p style="margin: 8px 0;">📞 +91-9372738439 &nbsp;|&nbsp; 📧 hr@eliteforums.in</p>
          <p style="margin: 16px 0 0 0; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-style: italic;">
            "Empowering Businesses Through Technology & Training"
          </p>
          <p style="margin: 8px 0; color: #d1d5db; font-size: 11px;">
            This is an official communication from Elite Forums. If you received this in error, please ignore.
          </p>
        </div>
      </body>
      </html>
    `;

    console.log("Sending email to candidate:", candidateEmail);

    // Send to candidate
    const emailResponse = await resend.emails.send({
      from: "Elite Forums HR <contact@eliteforums.in>",
      to: [candidateEmail],
      subject: `🎉 Offer Letter - ${position} Position at Elite Forums`,
      html: emailHtml,
    });

    console.log("Candidate email response:", JSON.stringify(emailResponse));

    if (emailResponse.error) {
      console.error("Resend error for candidate:", emailResponse.error);
      throw new Error(`Failed to send to candidate: ${emailResponse.error.message}`);
    }

    // Send copy to HR
    console.log("Sending copy to HR...");
    const hrEmailResponse = await resend.emails.send({
      from: "Elite Forums System <contact@eliteforums.in>",
      to: ["hr@eliteforums.in"],
      subject: `[HR Copy] Offer Letter Sent - ${candidateName} for ${position}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Offer Letter Copy - ${candidateName}</title>
        </head>
        <body style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #1a1a2e, #0f3460); padding: 20px; color: white;">
              <h2 style="margin: 0;">📋 HR Notification</h2>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Offer Letter Successfully Sent</p>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Candidate</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${candidateName}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${candidateEmail}">${candidateEmail}</a></td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Position</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${position}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Department</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${department || 'Not specified'}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Salary</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${salary}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Joining Date</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formattedDate}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Location</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${location}</td></tr>
                <tr><td style="padding: 12px; color: #6b7280;">Sent At</td><td style="padding: 12px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
              </table>
              
              <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #e94560;">
                <h4 style="margin: 0 0 12px 0; color: #1a1a2e;">Letter Content:</h4>
                <div style="font-size: 13px; line-height: 1.6; color: #374151;">
                  ${htmlContent}
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("HR email response:", JSON.stringify(hrEmailResponse));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Offer letter sent successfully to candidate and HR copy sent.",
        candidateEmailId: emailResponse.data?.id,
        hrEmailId: hrEmailResponse.data?.id
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error sending offer letter:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send offer letter";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);