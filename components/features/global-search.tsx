"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Save, Clock, Trash2, Filter } from "lucide-react";

interface SearchResult {
  type: "customer" | "policy" | "claim" | "payment" | "agent" | "loan";
  id: string;
  title: string;
  subtitle: string;
  metadata?: string;
  details?: Record<string, any>;
}

interface SavedSearch {
  id: number;
  name: string;
  query: string;
  type: string;
  status: string;
  dateRange: string;
  premiumRange: string;
  timestamp: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("quick");
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Advanced search filters
  const [searchType, setSearchType] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [premiumRange, setPremiumRange] = useState("all");
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchName, setSearchName] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowResults(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
    const recent = localStorage.getItem("recentSearches");
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: "20",
        type: searchType,
        status: status,
        dateRange: dateRange,
        premiumRange: premiumRange,
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success && data.allResults) {
        // Use the pre-formatted results from the API
        const formattedResults: SearchResult[] = data.allResults.map((r: any) => ({
          type: r.type as any,
          id: r._id || r.id,
          title: r.title,
          subtitle: r.subtitle,
          metadata: r.metadata,
          details: r.details,
        }));

        setResults(formattedResults);
        setShowResults(true);

        // Add to recent searches
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchType, status, dateRange, premiumRange]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setShowResults(false);

    const email = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "";

    if (result.type === "customer") {
      router.push(`/customers?email=${encodeURIComponent(email)}&highlight=${result.id}`);
    } else if (result.type === "policy") {
      router.push(`/policies?email=${encodeURIComponent(email)}&highlight=${result.id}`);
    } else if (result.type === "claim") {
      router.push(`/claims?email=${encodeURIComponent(email)}&highlight=${result.id}`);
    } else if (result.type === "payment") {
      router.push(`/payments?email=${encodeURIComponent(email)}&highlight=${result.id}`);
    } else if (result.type === "agent") {
      router.push(`/agents?email=${encodeURIComponent(email)}&highlight=${result.id}`);
    } else if (result.type === "loan") {
      router.push(`/loans?email=${encodeURIComponent(email)}&highlight=${result.id}`);
    }
  };

  const saveSearch = () => {
    if (!searchName.trim()) {
      alert("Please enter a name for this search");
      return;
    }

    const newSearch: SavedSearch = {
      id: Date.now(),
      name: searchName,
      query,
      type: searchType,
      status,
      dateRange,
      premiumRange,
      timestamp: new Date().toLocaleString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
    setSearchName("");
    alert("Search saved successfully!");
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setQuery(search.query);
    setSearchType(search.type);
    setStatus(search.status);
    setDateRange(search.dateRange);
    setPremiumRange(search.premiumRange);
    setActiveTab("quick");
  };

  const deleteSavedSearch = (id: number) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  const clearFilters = () => {
    setQuery("");
    setSearchType("all");
    setStatus("all");
    setDateRange("all");
    setPremiumRange("all");
    setResults([]);
    setShowResults(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "policy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "claim":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "payment":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "agent":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300";
      case "loan":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <>
      {/* Search Button in Navbar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Global Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Global Search
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full rounded-none border-b px-6 py-0 h-auto bg-transparent">
              <TabsTrigger value="quick" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Quick Search
              </TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                <Filter className="w-4 h-4 mr-2" />
                Advanced
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                Saved Searches
              </TabsTrigger>
              <TabsTrigger value="recent" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600">
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 overflow-hidden">
              {/* Quick Search Tab */}
              <TabsContent value="quick" className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Query</Label>
                  <div className="relative">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search customers, policies, claims, payments, agents, loans..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pr-10 text-base dark:bg-gray-800 dark:border-gray-700"
                      autoFocus
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {showResults && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">
                        Found {results.length} result{results.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {results.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No results found</p>
                        <p className="text-sm mt-2">Try a different search term or use advanced filters</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.map((result, index) => (
                          <Card
                            key={`${result.type}-${result.id}-${index}`}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => handleResultClick(result)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={getTypeColor(result.type)}>
                                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                                    </Badge>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                      {result.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {result.subtitle}
                                  </p>
                                  {result.metadata && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                      {result.metadata}
                                    </p>
                                  )}
                                </div>
                                <svg
                                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!query && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    <p className="font-medium">Search tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Search by customer name, email, or phone</li>
                      <li>Search by policy ID or policy number</li>
                      <li>Search by claim ID or transaction ID</li>
                      <li>Search by agent name or ID</li>
                      <li>Search by loan ID or customer name</li>
                      <li>Press ⌘K (or Ctrl+K) to open search</li>
                    </ul>
                  </div>
                )}
              </TabsContent>

              {/* Advanced Search Tab */}
              <TabsContent value="advanced" className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adv-search">Search Query</Label>
                    <Input
                      id="adv-search"
                      placeholder="Enter search term..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger id="type" className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="policy">Policy</SelectItem>
                          <SelectItem value="claim">Claim</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="loan">Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger id="dateRange" className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="premium">Premium Range</Label>
                      <Select value={premiumRange} onValueChange={setPremiumRange}>
                        <SelectTrigger id="premium" className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ranges</SelectItem>
                          <SelectItem value="0-10000">₹0 - ₹10,000</SelectItem>
                          <SelectItem value="10000-50000">₹10,000 - ₹50,000</SelectItem>
                          <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                          <SelectItem value="100000+">₹1,00,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Save this search as..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="text-sm dark:bg-gray-800 dark:border-gray-700"
                    />
                    <Button onClick={saveSearch} variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={clearFilters} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                {showResults && results.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-sm font-medium text-gray-600">Results ({results.length})</p>
                    {results.map((result, index) => (
                      <Card
                        key={`${result.type}-${result.id}-${index}`}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getTypeColor(result.type)} text-xs`}>
                                  {result.type}
                                </Badge>
                                <p className="font-medium text-sm truncate">{result.title}</p>
                              </div>
                              <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Saved Searches Tab */}
              <TabsContent value="saved" className="p-6 space-y-3">
                {savedSearches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Save className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No saved searches yet</p>
                    <p className="text-sm mt-2">Save your searches for quick access</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedSearches.map(search => (
                      <Card key={search.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 dark:text-gray-100">{search.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Query: {search.query} | Type: {search.type} | Status: {search.status}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{search.timestamp}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => loadSavedSearch(search)}
                              >
                                Load
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteSavedSearch(search.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Recent Searches Tab */}
              <TabsContent value="recent" className="p-6 space-y-3">
                {recentSearches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No recent searches</p>
                    <p className="text-sm mt-2">Your search history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setQuery(search)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-700 dark:text-gray-300">{search}</p>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
