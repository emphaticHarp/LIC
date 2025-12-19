"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Save } from "lucide-react";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  metadata: Record<string, any>;
}

export function AdvancedSearchFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [premiumRange, setPremiumRange] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchName, setSearchName] = useState("");

  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "Policy",
      title: "LIC-123456789",
      description: "Life Insurance Policy - Rajesh Kumar",
      metadata: { status: "active", premium: "₹25,000", term: "20 years" },
    },
    {
      id: "2",
      type: "Customer",
      title: "Rajesh Kumar",
      description: "Customer ID: CUST-001",
      metadata: { email: "rajesh@example.com", phone: "+91-9876543210", status: "active" },
    },
    {
      id: "3",
      type: "Claim",
      title: "CLM-123456",
      description: "Life Insurance Claim",
      metadata: { status: "approved", amount: "₹50,00,000", date: "2024-12-06" },
    },
    {
      id: "4",
      type: "Payment",
      title: "PAY-001",
      description: "Premium Payment",
      metadata: { status: "completed", amount: "₹25,000", method: "cash" },
    },
  ];

  const performSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
      return;
    }

    let filtered = mockResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = searchType === "all" || result.type === searchType;
      return matchesQuery && matchesType;
    });

    setResults(filtered);
    setHasSearched(true);
  };

  const saveSearch = () => {
    if (!searchName.trim()) {
      alert("Please enter a name for this search");
      return;
    }

    const newSearch = {
      id: Date.now(),
      name: searchName,
      query: searchQuery,
      type: searchType,
      status,
      dateRange,
      premiumRange,
      timestamp: new Date().toLocaleString(),
    };

    setSavedSearches([...savedSearches, newSearch]);
    setSearchName("");
    alert("Search saved successfully!");
  };

  const loadSavedSearch = (search: any) => {
    setSearchQuery(search.query);
    setSearchType(search.type);
    setStatus(search.status);
    setDateRange(search.dateRange);
    setPremiumRange(search.premiumRange);
  };

  const deleteSavedSearch = (id: number) => {
    setSavedSearches(savedSearches.filter(s => s.id !== id));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchType("all");
    setStatus("all");
    setDateRange("all");
    setPremiumRange("all");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" /> Advanced Search & Filtering
          </CardTitle>
          <CardDescription>Search across policies, customers, claims, and payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Query</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search by policy ID, customer name, claim ID, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && performSearch()}
                  className="text-lg"
                />
                <Button onClick={performSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Claim">Claim</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
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
                  <SelectTrigger id="dateRange">
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
                  <SelectTrigger id="premium">
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

              <div className="flex items-end">
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Save this search as..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="text-sm"
            />
            <Button onClick={saveSearch} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
            <CardDescription>Found {results.length} matching results</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No results found. Try adjusting your search criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(result => (
                  <div key={result.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="font-semibold text-gray-800">{result.title}</p>
                        <p className="text-sm text-gray-600">{result.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          {Object.entries(result.metadata).map(([key, value]) => (
                            <span key={key}>
                              <strong>{key}:</strong> {String(value)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {savedSearches.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Saved Searches ({savedSearches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedSearches.map(search => (
                <div key={search.id} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-800">{search.name}</p>
                    <p className="text-xs text-gray-500">{search.timestamp}</p>
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
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
