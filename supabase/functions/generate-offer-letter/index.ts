import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OfferLetterRequest {
  candidateName: string;
  candidateEmail: string;
  candidateAddress: string;
  position: string;
  department: string;
  salary: string;
  joiningDate: string;
  location: string;
  additionalDetails: string;
  hrManagerName: string;
  hrManagerEmail: string;
  hrManagerPhone: string;
  acceptanceDeadline: string;
  formattedJoiningDate: string;
  formattedAcceptanceDeadline: string;
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

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const prompt = `Generate a professional offer letter for a candidate with the following details:

Company: Elite Forums (IT Company based in Vasai, Maharashtra, India)
Company Address: Shop No. 7, Golden Park Rd, near D Mart, Evershine City, Vasai-Virar, Maharashtra 401208

Current Date: ${currentDate}

Candidate Name: ${data.candidateName}
Candidate Address: ${data.candidateAddress || 'Not provided'}
Position: ${data.position}
Department: ${data.department || 'Not specified'}
Annual CTC: ${data.salary}
Joining Date: ${data.formattedJoiningDate || 'To be confirmed'}
Work Location: ${data.location}
Additional Details: ${data.additionalDetails || 'None'}

HR Manager Name: ${data.hrManagerName}
HR Manager Email: ${data.hrManagerEmail}
HR Manager Phone: ${data.hrManagerPhone}
Offer Acceptance Deadline: ${data.formattedAcceptanceDeadline || '5 business days from the date of this letter'}

Please generate a formal, professional offer letter that includes:
1. The current date at the top
2. Company letterhead information
3. Candidate's name and address (if provided)
4. Subject line for the offer
5. A warm welcome and congratulations
6. Position and department details
7. Compensation package details (Annual CTC: ${data.salary})
8. Joining date: ${data.formattedJoiningDate || 'To be confirmed'} and work location: ${data.location}
9. Standard terms about probation period (3 months)
10. Working hours (9 AM to 6 PM, Monday to Saturday)
11. Required documents to bring on joining:
    - Educational Certificates (10th, 12th, Graduation, and any other relevant qualifications)
    - Experience Certificates from previous employers (if applicable)
    - Relieving Letter from previous employer (if applicable)
    - Aadhar Card
    - PAN Card
    - Bank Account Details (Cancel cheque or passbook copy)
    - Passport Size Photographs (4 copies)
    - Address Proof (e.g., Electricity Bill, Rent Agreement)
12. Acceptance deadline: ${data.formattedAcceptanceDeadline || '5 business days from the date of this letter'}
13. Contact information for HR: ${data.hrManagerName}, ${data.hrManagerEmail}, ${data.hrManagerPhone}
14. Professional closing with signature block for:
    - HR Manager: ${data.hrManagerName}
    - Candidate acceptance signature line with name: ${data.candidateName} and date field

Format the letter properly with appropriate headings and sections. Use a professional but warm tone suitable for an Indian IT company. 

IMPORTANT: 
- Include ALL the actual values provided above, do NOT leave placeholders like [Current Date] or [HR Manager's Name]
- Use the actual date: ${currentDate}
- Use the actual HR Manager name: ${data.hrManagerName}
- Use the actual HR email: ${data.hrManagerEmail}
- Use the actual HR phone: ${data.hrManagerPhone}
- Use the actual candidate name: ${data.candidateName}
- Use the actual joining date: ${data.formattedJoiningDate || 'To be confirmed'}
- Use the actual acceptance deadline: ${data.formattedAcceptanceDeadline || '5 business days from the date of this letter'}`;

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
            content: "You are an expert HR professional who creates formal, professional offer letters for an IT company in India. Your letters are warm yet professional, legally appropriate, and follow Indian business letter conventions. NEVER use placeholder text like [brackets] - always use the actual values provided in the prompt.",
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
