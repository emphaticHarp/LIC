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


