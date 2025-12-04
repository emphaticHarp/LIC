import { NextRequest, NextResponse } from "next/server";

// Using the NewsAPI key provided for this project.
// If you later prefer env vars, replace this with: const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_KEY = "59ba3a693f644c8eb49bffcc7fae1c02";

export async function GET(_req: NextRequest) {

  try {
    // Use NewsAPI.org to fetch India business / LIC / economy related news
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set(
      "q",
      '(LIC OR "Life Insurance Corporation" OR insurance) AND (India OR Indian OR economy OR market)'
    );
    url.searchParams.set("language", "en");
    url.searchParams.set("sortBy", "publishedAt");
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    url.searchParams.set("from", today);
    url.searchParams.set("to", today);
    
    url.searchParams.set("pageSize", "12");
    url.searchParams.set("apiKey", NEWSAPI_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const text = await response.text();
      console.error("NewsAPI error:", response.status, text);
      return NextResponse.json(
        { success: false, error: "Failed to fetch news from upstream API" },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    // If no articles found for today, fetch recent articles (last 3 days)
    if (!data.articles || data.articles.length === 0) {
      console.log("No articles found for today, fetching recent news...");
      
      // Create fallback URL for recent news (last 3 days)
      const fallbackUrl = new URL("https://newsapi.org/v2/everything");
      fallbackUrl.searchParams.set(
        "q",
        '(LIC OR "Life Insurance Corporation" OR insurance) AND (India OR Indian OR economy OR market)'
      );
      fallbackUrl.searchParams.set("language", "en");
      fallbackUrl.searchParams.set("sortBy", "publishedAt");
      
      // Set date range for last 3 days
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      fallbackUrl.searchParams.set("from", threeDaysAgo.toISOString().split('T')[0]);
      fallbackUrl.searchParams.set("to", new Date().toISOString().split('T')[0]);
      
      fallbackUrl.searchParams.set("pageSize", "12");
      fallbackUrl.searchParams.set("apiKey", NEWSAPI_KEY);
      
      const fallbackResponse = await fetch(fallbackUrl.toString());
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        data.articles = fallbackData.articles;
        console.log("Using fallback recent news");
      }
    }

    const normalized =
      Array.isArray(data?.articles) &&
      data.articles.map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source?.name,
        category: "Business / Economy",
        published_at: a.publishedAt,
      }));

    return NextResponse.json(
      {
        success: true,
        articles: Array.isArray(normalized) ? normalized : [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected error while fetching news" },
      { status: 500 }
    );
  }
}


