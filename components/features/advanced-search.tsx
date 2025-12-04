"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SearchResult {
  type: "customer" | "policy" | "claim" | "payment";
  id: string;
  title: string;
  subtitle: string;
  metadata?: string;
}

export function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      const data = await response.json();

      if (data.success && data.results) {
        const formattedResults: SearchResult[] = [];

        // Process customers
        if (data.results.customers && Array.isArray(data.results.customers)) {
          data.results.customers.forEach((r: any) => {
            formattedResults.push({
              type: "customer",
              id: r._id || r.customerId,
              title: r.name || "Unknown Customer",
              subtitle: r.email || r.phone || "No contact info",
              metadata: `Status: ${r.status || "N/A"}`,
            });
          });
        }

        // Process policies
        if (data.results.policies && Array.isArray(data.results.policies)) {
          data.results.policies.forEach((r: any) => {
            formattedResults.push({
              type: "policy",
              id: r._id || r.policyNumber,
              title: `Policy ${r.policyNumber || r._id}`,
              subtitle: r.customer?.name || "Unknown Customer",
              metadata: `Type: ${r.policyType || "N/A"} | Status: ${r.status || "N/A"}`,
            });
          });
        }

        // Process claims
        if (data.results.claims && Array.isArray(data.results.claims)) {
          data.results.claims.forEach((r: any) => {
            formattedResults.push({
              type: "claim",
              id: r._id || r.claimId,
              title: `Claim ${r.claimId || r._id}`,
              subtitle: r.customerName || "Unknown",
              metadata: `Amount: ${r.claimAmount || "N/A"} | Status: ${r.status || "N/A"}`,
            });
          });
        }

        // Process payments
        if (data.results.payments && Array.isArray(data.results.payments)) {
          data.results.payments.forEach((r: any) => {
            formattedResults.push({
              type: "payment",
              id: r._id || r.transactionId,
              title: `Payment ${r.transactionId || r._id}`,
              subtitle: r.customerName || "Unknown",
              metadata: `Amount: ${r.amount || "N/A"} | Status: ${r.status || "N/A"}`,
            });
          });
        }

        setResults(formattedResults);
        setShowResults(true);
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
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setShowResults(false);
    setQuery("");

    if (result.type === "customer") {
      router.push(`/customers?email=${encodeURIComponent(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "")}&highlight=${result.id}`);
    } else if (result.type === "policy") {
      router.push(`/policies?email=${encodeURIComponent(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "")}&highlight=${result.id}`);
    } else if (result.type === "claim") {
      router.push(`/claims?email=${encodeURIComponent(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "")}&highlight=${result.id}`);
    } else if (result.type === "payment") {
      router.push(`/payments?email=${encodeURIComponent(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "")}&highlight=${result.id}`);
    }
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Advanced Search</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6" ref={searchRef}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search customers, policies, claims, payments... (Press ⌘K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pr-10 dark:bg-gray-800 dark:border-gray-700"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {showResults && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No results found</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-2">
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
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">Search tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Search by customer name, email, or phone</li>
                  <li>Search by policy ID or policy number</li>
                  <li>Search by claim ID or transaction ID</li>
                  <li>Press ⌘K (or Ctrl+K) to open search</li>
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

