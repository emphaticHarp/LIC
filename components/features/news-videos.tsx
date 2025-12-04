"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, ExternalLink, TrendingUp, MapPin, Globe, Tv, Clock, RefreshCw } from "lucide-react";

interface NewsChannel {
  id: string;
  name: string;
  type: "live" | "recorded";
  category: "national" | "economic" | "tripura" | "international";
  streamUrl?: string;
  description: string;
  language: string;
  isLive?: boolean;
  viewers?: number;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  category?: string | string[];
}

export function NewsVideos() {
  const [selectedChannel, setSelectedChannel] = useState<NewsChannel | null>(null);
  const [activeTab, setActiveTab] = useState("live");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const newsChannels: NewsChannel[] = [
    {
      id: "1",
      name: "NDTV India",
      type: "live",
      category: "national",
      streamUrl: "https://www.youtube.com/embed/WtLM5WYWs-I",
      description: "24/7 Hindi news channel covering national politics, economy, and current affairs",
      language: "Hindi",
      isLive: true,
      viewers: 125000
    },
    {
      id: "2",
      name: "CNBC TV18",
      type: "live",
      category: "economic",
      streamUrl: "https://www.youtube.com/embed/RKKt5Qg2s6I",
      description: "India's leading business news channel - stock markets, economy, corporate news",
      language: "English",
      isLive: true,
      viewers: 75000
    },
    {
      id: "3",
      name: "Republic Bharat",
      type: "live",
      category: "national",
      streamUrl: "https://www.youtube.com/embed/6t7N_wD8JtI",
      description: "Hindi news channel with focus on investigative journalism and debates",
      language: "Hindi",
      isLive: true,
      viewers: 98000
    },
    {
      id: "4",
      name: "India Today",
      type: "live",
      category: "national",
      streamUrl: "https://www.youtube.com/embed/0CocL2a8p9g",
      description: "Leading English news channel covering politics, business, and current affairs",
      language: "English",
      isLive: true,
      viewers: 156000
    }
  ];

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    setIsNewsLoading(true);
    setNewsError(null);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (response.ok && data.success) {
        setNewsArticles(data.articles || []);
        setNewsError(null);
        setLastUpdated(new Date());
      } else {
        setNewsError(data.error || 'Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsError('Network error while loading news');
    } finally {
      setIsNewsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "national": return "bg-blue-100 text-blue-700";
      case "economic": return "bg-green-100 text-green-700";
      case "tripura": return "bg-orange-100 text-orange-700";
      case "international": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "national": return <Tv className="w-4 h-4" />;
      case "economic": return <TrendingUp className="w-4 h-4" />;
      case "tripura": return <MapPin className="w-4 h-4" />;
      case "international": return <Globe className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatViewers = (viewers: number) => {
    if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(1)}K`;
    }
    return viewers.toString();
  };

  const handleChannelSelect = (channel: NewsChannel) => {
    setSelectedChannel(channel);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">News & Media</h2>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString('en-IN', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchNewsArticles}
          disabled={isNewsLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isNewsLoading ? 'animate-spin' : ''}`} />
          Refresh News
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="articles">News Articles</TabsTrigger>
          <TabsTrigger value="live">Live TV</TabsTrigger>
          <TabsTrigger value="economic">Economic</TabsTrigger>
          <TabsTrigger value="tripura">Tripura</TabsTrigger>
          <TabsTrigger value="national">National</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>LIC & Market News</CardTitle>
                  <CardDescription>
                    Latest updates on LIC, Indian insurance sector, and key economic headlines.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchNewsArticles}
                  disabled={isNewsLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isNewsLoading ? 'animate-spin' : ''}`} />
                  {isNewsLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isNewsLoading ? (
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-1/3 bg-gray-100 animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : newsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {newsError}
                </div>
              ) : newsArticles.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No recent news found. Please try again later.
                </p>
              ) : (
                <div className="space-y-3">
                  {newsArticles.map((article: any, index: number) => (
                    <Card
                      key={`${article.url || article.title || "news"}-${index}`}
                      className="border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            {article.title || "Untitled article"}
                          </h3>
                          <div className="flex items-center gap-2">
                            {article.category && (
                              <Badge variant="outline" className="text-xs">
                                {Array.isArray(article.category)
                                  ? article.category.join(", ")
                                  : article.category}
                              </Badge>
                            )}
                            {article.source && (
                              <span className="text-[11px] text-gray-500">
                                {article.source}
                              </span>
                            )}
                          </div>
                        </div>
                        {article.description && (
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                            {article.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="text-[11px] text-gray-500">
                            {article.published_at
                              ? new Date(article.published_at).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "Time not available"}
                          </span>
                          {article.url && (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                              Read full article
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          {selectedChannel ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(selectedChannel.category)}
                      {selectedChannel.name}
                    </CardTitle>
                    <CardDescription>{selectedChannel.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedChannel.isLive && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <Badge variant="destructive" className="text-xs">
                          LIVE
                        </Badge>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {selectedChannel.language}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChannel(null)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={selectedChannel.streamUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Language: {selectedChannel.language}</span>
                    <span>Viewers: {formatViewers(selectedChannel.viewers || 0)}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={selectedChannel.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in YouTube
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {newsChannels.map((channel) => (
                <Card
                  key={channel.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleChannelSelect(channel)}
                >
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    {channel.isLive && (
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <Badge variant="destructive" className="text-xs">
                          LIVE
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="text-xs bg-black/50 text-white">
                        {formatViewers(channel.viewers || 0)} watching
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{channel.name}</h3>
                      <Badge className={`text-xs ${getCategoryColor(channel.category)}`}>
                        {channel.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {channel.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{channel.language}</span>
                      <span>{formatViewers(channel.viewers || 0)} viewers</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="economic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newsChannels.filter(c => c.category === "economic").map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-gray-400" />
                  </div>
                  {channel.isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <Badge variant="destructive" className="text-xs">
                        LIVE
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{channel.name}</h3>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                      Economic
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{channel.language}</span>
                    <span>{formatViewers(channel.viewers || 0)} viewers</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Live
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tripura" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newsChannels.filter(c => c.category === "tripura").map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  {channel.isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <Badge variant="destructive" className="text-xs">
                        LIVE
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{channel.name}</h3>
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                      Tripura
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{channel.language}</span>
                    <span>{formatViewers(channel.viewers || 0)} viewers</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Live
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="national" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newsChannels.filter(c => c.category === "national").map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Tv className="w-12 h-12 text-gray-400" />
                  </div>
                  {channel.isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <Badge variant="destructive" className="text-xs">
                        LIVE
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{channel.name}</h3>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      National
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{channel.language}</span>
                    <span>{formatViewers(channel.viewers || 0)} viewers</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Live
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
