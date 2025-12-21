import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OfferLetterRequest {
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  salary: string;
  joiningDate: string;
  location: string;
  additionalDetails: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OfferLetterRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating offer letter for:", data.candidateName);

    const formattedDate = data.joiningDate 
      ? new Date(data.joiningDate).toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      : 'To be confirmed';

    const prompt = `Generate a professional offer letter for a candidate with the following details:

Company: Elite Forums (IT Company based in Vasai, Maharashtra, India)
Company Address: Shop No. 7, Golden Park Rd, near D Mart, Evershine City, Vasai-Virar, Maharashtra 401208

Candidate Name: ${data.candidateName}
Position: ${data.position}
Department: ${data.department || 'Not specified'}
Annual CTC: ${data.salary}
Joining Date: ${formattedDate}
Work Location: ${data.location}
Additional Details: ${data.additionalDetails || 'None'}

Please generate a formal, professional offer letter that includes:
1. A warm welcome and congratulations
2. Position and department details
3. Compensation package details
4. Joining date and location
5. Standard terms about probation period (3 months)
6. Working hours (9 AM to 6 PM, Monday to Saturday)
7. Required documents to bring on joining
8. Contact information for HR
9. Professional closing

Format the letter properly with appropriate headings and sections. Use a professional but warm tone suitable for an Indian IT company. Include a signature line at the end for the HR Manager.

Important: Make the letter look professional and complete. Include the current date at the top.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert HR professional who creates formal, professional offer letters for an IT company in India. Your letters are warm yet professional, legally appropriate, and follow Indian business letter conventions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const offerLetter = aiResponse.choices?.[0]?.message?.content;

    if (!offerLetter) {
      throw new Error("No content generated");
    }

    console.log("Offer letter generated successfully");

    return new Response(
      JSON.stringify({ offerLetter }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error generating offer letter:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate offer letter";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
