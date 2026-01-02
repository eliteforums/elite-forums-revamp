import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    const { category = 'technology' } = await req.json().catch(() => ({}));

    const currentDate = new Date().toISOString().split('T')[0];
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { 
            role: 'system', 
            content: `You are a tech news curator. Generate exactly 6 trending tech news articles as a JSON array. Each article must have: title (catchy headline), summary (2-3 sentences), category (one of: AI, Cybersecurity, Cloud, Software, Startups, Innovation), imageKeyword (unique keyword for each article like "robot", "server", "hacker", "code", "startup", "innovation" - each must be DIFFERENT), source (reputable tech source name), sourceUrl (the actual URL to the article if available, or empty string if not), publishedAt (today's date: ${currentDate}), readTime (e.g. "3 min read"). IMPORTANT: Each article MUST have a DIFFERENT imageKeyword. Return ONLY valid JSON array, no markdown, no explanation.`
          },
          { 
            role: 'user', 
            content: `Get the latest trending ${category} news from today. Focus on breaking news, major announcements, and significant developments in the tech industry. Include source URLs when available.` 
          }
        ],
        search_recency_filter: 'day',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    const citations = data.citations || [];
    
    // Try to parse the JSON from the response
    let articles;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      articles = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse articles:', parseError, 'Content:', content);
      // Return fallback articles with unique images
      articles = [
        {
          title: "AI Revolution Continues to Transform Industries",
          summary: "Artificial intelligence continues to reshape how businesses operate, with new breakthroughs in machine learning and automation driving innovation across sectors.",
          category: "AI",
          imageKeyword: "artificial-intelligence",
          source: "Tech Daily",
          sourceUrl: "",
          publishedAt: currentDate,
          readTime: "4 min read"
        },
        {
          title: "Cloud Computing Market Sees Record Growth",
          summary: "Major cloud providers report unprecedented growth as enterprises accelerate digital transformation initiatives.",
          category: "Cloud",
          imageKeyword: "data-center",
          source: "Cloud Weekly",
          sourceUrl: "",
          publishedAt: currentDate,
          readTime: "3 min read"
        },
        {
          title: "Cybersecurity Threats Evolve in 2025",
          summary: "Security experts warn of sophisticated new attack vectors as organizations scramble to protect their digital assets.",
          category: "Cybersecurity",
          imageKeyword: "security-lock",
          source: "Security Now",
          sourceUrl: "",
          publishedAt: currentDate,
          readTime: "5 min read"
        },
        {
          title: "Startup Ecosystem Thrives Despite Economic Headwinds",
          summary: "Tech startups continue to attract investment as innovation remains strong in key sectors like AI and clean technology.",
          category: "Startups",
          imageKeyword: "office-team",
          source: "Startup Insider",
          sourceUrl: "",
          publishedAt: currentDate,
          readTime: "3 min read"
        },
        {
          title: "Software Development Trends to Watch",
          summary: "From low-code platforms to AI-assisted development, the software industry is evolving rapidly with new tools and methodologies.",
          category: "Software",
          imageKeyword: "programming-code",
          source: "Dev Weekly",
          sourceUrl: "",
          publishedAt: currentDate,
          readTime: "4 min read"
        },
        {
          title: "Tech Innovation Summit Highlights Future Technologies",
          summary: "Industry leaders gather to showcase breakthrough technologies that will shape the next decade of computing and connectivity.",
          category: "Innovation",
          imageKeyword: "technology-future",
          source: "Innovation Today",
          sourceUrl: "",
          publishedAt: currentDate,
          readTime: "6 min read"
        }
      ];
    }

    // Unique image mapping - ensures each article gets a different image
    const uniqueImageIds = [
      '1677442136019-21780ecad995', // AI/robot
      '1451187580459-43490279c0fa', // Cloud/data center
      '1550751827-4bd374c3f58b', // Cybersecurity
      '1559136555-9303baea8ebd', // Startup/office
      '1461749280684-dccba630e2f6', // Software/code
      '1518770660439-4636190af475', // Innovation/tech
      '1526374965328-7f61d4dc18c5', // Programming
      '1563986768609-322da13575f3', // Security
      '1551288049-bebda4e38f71', // Data
      '1639762681485-074b7f938ba0', // Blockchain
    ];

    // Add image URLs with unique images for each article
    const articlesWithImages = articles.map((article: { imageKeyword?: string; sourceUrl?: string }, index: number) => {
      // Use index-based unique image selection
      const imageId = uniqueImageIds[index % uniqueImageIds.length];
      
      // Try to get source URL from citations if not provided
      let articleUrl = article.sourceUrl || '';
      if (!articleUrl && citations.length > index) {
        articleUrl = citations[index] || '';
      }
      
      return {
        ...article,
        id: index + 1,
        imageUrl: `https://images.unsplash.com/photo-${imageId}?w=800&h=450&fit=crop`,
        sourceUrl: articleUrl
      };
    });

    return new Response(JSON.stringify({ articles: articlesWithImages, citations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error fetching tech news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
