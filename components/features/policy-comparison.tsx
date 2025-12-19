"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, X } from "lucide-react";

export function PolicyComparison() {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);

  const policies = [
    {
      id: "term-20",
      name: "Term Life 20 Years",
      premium: "₹500/month",
      sumAssured: "₹50,00,000",
      coverage: ["Death benefit", "Accidental death", "Disability waiver"],
      features: {
        "Death Benefit": true,
        "Accidental Death": true,
        "Disability Waiver": true,
        "Maturity Benefit": false,
        "Loan Facility": false,
        "Surrender Value": false,
      },
      rating: 4.5,
      reviews: 1250,
    },
    {
      id: "endowment",
      name: "Endowment Plan",
      premium: "₹2,500/month",
      sumAssured: "₹50,00,000",
      coverage: ["Death benefit", "Maturity benefit", "Bonus"],
      features: {
        "Death Benefit": true,
        "Accidental Death": true,
        "Disability Waiver": true,
        "Maturity Benefit": true,
        "Loan Facility": true,
        "Surrender Value": true,
      },
      rating: 4.2,
      reviews: 890,
    },
    {
      id: "ulip",
      name: "ULIP Plan",
      premium: "₹3,000/month",
      sumAssured: "₹50,00,000",
      coverage: ["Death benefit", "Investment returns", "Flexibility"],
      features: {
        "Death Benefit": true,
        "Accidental Death": true,
        "Disability Waiver": false,
        "Maturity Benefit": true,
        "Loan Facility": true,
        "Surrender Value": true,
      },
      rating: 4.0,
      reviews: 650,
    },
  ];

  const togglePolicy = (id: string) => {
    setSelectedPolicies((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const comparisonFeatures = [
    "Death Benefit",
    "Accidental Death",
    "Disability Waiver",
    "Maturity Benefit",
    "Loan Facility",
    "Surrender Value",
  ];

  const selectedPoliciesData = policies.filter((p) => selectedPolicies.includes(p.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Policy Comparison Tool</CardTitle>
          <CardDescription>Compare different insurance policies side by side</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedPolicies.includes(policy.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => togglePolicy(policy.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{policy.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm font-medium">{policy.rating}</span>
                      <span className="text-xs text-gray-500">({policy.reviews} reviews)</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPolicies.includes(policy.id)}
                    onChange={() => {}}
                    className="w-5 h-5"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Premium</p>
                    <p className="font-bold text-lg">{policy.premium}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sum Assured</p>
                    <p className="font-semibold">{policy.sumAssured}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPoliciesData.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Detailed Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      {selectedPoliciesData.map((policy) => (
                        <th key={policy.id} className="text-center py-3 px-4 font-semibold">
                          {policy.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Premium</td>
                      {selectedPoliciesData.map((policy) => (
                        <td key={policy.id} className="text-center py-3 px-4">
                          {policy.premium}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Sum Assured</td>
                      {selectedPoliciesData.map((policy) => (
                        <td key={policy.id} className="text-center py-3 px-4">
                          {policy.sumAssured}
                        </td>
                      ))}
                    </tr>
                    {comparisonFeatures.map((feature) => (
                      <tr key={feature} className="border-b">
                        <td className="py-3 px-4 font-medium">{feature}</td>
                        {selectedPoliciesData.map((policy) => (
                          <td key={policy.id} className="text-center py-3 px-4">
                            {policy.features[feature as keyof typeof policy.features] ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Rating</td>
                      {selectedPoliciesData.map((policy) => (
                        <td key={policy.id} className="text-center py-3 px-4">
                          <Badge variant="outline">{policy.rating} ★</Badge>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold mb-2">Recommendation</p>
                <p className="text-sm text-gray-700">
                  Based on your comparison, the{" "}
                  <span className="font-semibold">
                    {selectedPoliciesData[0]?.name}
                  </span>{" "}
                  offers the best value for comprehensive coverage with competitive premiums.
                </p>
              </div>
            </div>
          )}

          {selectedPoliciesData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Select 1-3 policies to compare their features and benefits
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
