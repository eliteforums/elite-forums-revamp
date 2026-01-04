import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TaskReminderRequest {
  taskId: string;
  recipients: string[];
  subject: string;
  body: string;
  taskTitle: string;
  scheduledAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId, recipients, subject, body, taskTitle, scheduledAt }: TaskReminderRequest = await req.json();

    console.log(`Sending reminder for task ${taskId} to ${recipients.length} recipients`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const scheduledDate = new Date(scheduledAt);
    const formattedDate = scheduledDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = scheduledDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlBody = body
      ? body.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      : "";

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
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Task Reminder</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(90deg, #e94560 0%, #f97316 100%); color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px;">${taskTitle}</h2>
            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">
              📅 ${formattedDate} at ${formattedTime}
            </p>
          </div>
          
          ${htmlBody ? `
          <div style="font-size: 15px; line-height: 1.8; color: #374151; margin-top: 20px;">
            ${htmlBody}
          </div>
          ` : ""}
          
          <div style="margin-top: 20px; padding: 16px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This is an automated reminder from Elite Forums Admin Panel.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;"><strong style="color: #1a1a2e;">Elite Forums</strong></p>
          <p style="margin: 5px 0;">📧 hello@eliteforums.in</p>
          <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #9ca3af;">
            "Empowering Businesses Through Technology & Training"
          </p>
        </div>
      </body>
      </html>
    `;

    // Send to all recipients
    for (const recipient of recipients) {
      try {
        await resend.emails.send({
          from: "Elite Forums <hello@eliteforums.in>",
          to: [recipient],
          subject: subject || `Reminder: ${taskTitle}`,
          html: emailHtml,
        });
        console.log(`Reminder sent to ${recipient}`);
      } catch (emailError) {
        console.error(`Failed to send reminder to ${recipient}:`, emailError);
      }
    }

    // Mark reminder as sent
    const { error: updateError } = await supabase
      .from("scheduled_tasks")
      .update({ reminder_sent: true })
      .eq("id", taskId);

    if (updateError) {
      console.error("Error updating task reminder status:", updateError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-task-reminder function:", error);
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
