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
            content: `You are a tech news curator. Generate exactly 6 trending tech news articles as a JSON array. Each article must have: title (catchy headline), summary (2-3 sentences), category (one of: AI, Cybersecurity, Cloud, Software, Startups, Innovation), imageKeyword (single word for image search like "robot", "cloud", "security"), source (reputable tech source name), publishedAt (today's date: ${currentDate}), readTime (e.g. "3 min read"). Return ONLY valid JSON array, no markdown, no explanation.`
          },
          { 
            role: 'user', 
            content: `Get the latest trending ${category} news from today. Focus on breaking news, major announcements, and significant developments in the tech industry.` 
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
    
    // Try to parse the JSON from the response
    let articles;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      articles = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse articles:', parseError, 'Content:', content);
      // Return fallback articles
      articles = [
        {
          title: "AI Revolution Continues to Transform Industries",
          summary: "Artificial intelligence continues to reshape how businesses operate, with new breakthroughs in machine learning and automation driving innovation across sectors.",
          category: "AI",
          imageKeyword: "artificial-intelligence",
          source: "Tech Daily",
          publishedAt: currentDate,
          readTime: "4 min read"
        },
        {
          title: "Cloud Computing Market Sees Record Growth",
          summary: "Major cloud providers report unprecedented growth as enterprises accelerate digital transformation initiatives.",
          category: "Cloud",
          imageKeyword: "cloud-computing",
          source: "Cloud Weekly",
          publishedAt: currentDate,
          readTime: "3 min read"
        },
        {
          title: "Cybersecurity Threats Evolve in 2025",
          summary: "Security experts warn of sophisticated new attack vectors as organizations scramble to protect their digital assets.",
          category: "Cybersecurity",
          imageKeyword: "cybersecurity",
          source: "Security Now",
          publishedAt: currentDate,
          readTime: "5 min read"
        },
        {
          title: "Startup Ecosystem Thrives Despite Economic Headwinds",
          summary: "Tech startups continue to attract investment as innovation remains strong in key sectors like AI and clean technology.",
          category: "Startups",
          imageKeyword: "startup",
          source: "Startup Insider",
          publishedAt: currentDate,
          readTime: "3 min read"
        },
        {
          title: "Software Development Trends to Watch",
          summary: "From low-code platforms to AI-assisted development, the software industry is evolving rapidly with new tools and methodologies.",
          category: "Software",
          imageKeyword: "programming",
          source: "Dev Weekly",
          publishedAt: currentDate,
          readTime: "4 min read"
        },
        {
          title: "Tech Innovation Summit Highlights Future Technologies",
          summary: "Industry leaders gather to showcase breakthrough technologies that will shape the next decade of computing and connectivity.",
          category: "Innovation",
          imageKeyword: "technology",
          source: "Innovation Today",
          publishedAt: currentDate,
          readTime: "6 min read"
        }
      ];
    }

    // Add image URLs using Unsplash
    const articlesWithImages = articles.map((article: { imageKeyword?: string }, index: number) => ({
      ...article,
      id: index + 1,
      imageUrl: `https://images.unsplash.com/photo-${getUnsplashPhotoId(article.imageKeyword || 'technology')}?w=800&h=450&fit=crop`
    }));

    return new Response(JSON.stringify({ articles: articlesWithImages, citations: data.citations || [] }), {
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

function getUnsplashPhotoId(keyword: string): string {
  const photoIds: Record<string, string> = {
    'artificial-intelligence': '1677442136019-21780ecad995',
    'robot': '1485827404703-89b55fcc595e',
    'ai': '1677442136019-21780ecad995',
    'cloud': '1544197150-b99a580bb7a8',
    'cloud-computing': '1451187580459-43490279c0fa',
    'cybersecurity': '1550751827-4bd374c3f58b',
    'security': '1563986768609-322da13575f3',
    'startup': '1559136555-9303baea8ebd',
    'software': '1461749280684-dccba630e2f6',
    'programming': '1526374965328-7f61d4dc18c5',
    'innovation': '1518770660439-4636190af475',
    'technology': '1518770660439-4636190af475',
    'data': '1551288049-bebda4e38f71',
    'network': '1558494949-ef010cbdcc31',
    'mobile': '1512941937-f48cc3380439',
    'blockchain': '1639762681485-074b7f938ba0',
  };
  return photoIds[keyword.toLowerCase()] || photoIds['technology'];
}
