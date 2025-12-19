"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Download } from "lucide-react";

interface ComplianceItem {
  id: string;
  category: string;
  item: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export function ComplianceChecklist() {
  const [items, setItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      category: "Policy Documentation",
      item: "Policy Document Signed",
      description: "Ensure policy document is properly signed by customer",
      completed: true,
      dueDate: "2024-12-06",
      priority: "high",
    },
    {
      id: "2",
      category: "Policy Documentation",
      item: "KYC Verification Complete",
      description: "Customer KYC must be verified before policy issuance",
      completed: true,
      dueDate: "2024-12-06",
      priority: "high",
    },
    {
      id: "3",
      category: "Policy Documentation",
      item: "Nominee Details Recorded",
      description: "Nominee information must be documented",
      completed: false,
      dueDate: "2024-12-10",
      priority: "high",
    },
    {
      id: "4",
      category: "Medical Underwriting",
      item: "Medical Report Submitted",
      description: "Medical examination report for high sum assured",
      completed: false,
      dueDate: "2024-12-15",
      priority: "high",
    },
    {
      id: "5",
      category: "Medical Underwriting",
      item: "Health Declaration Form",
      description: "Customer health declaration form completed",
      completed: true,
      dueDate: "2024-12-06",
      priority: "medium",
    },
    {
      id: "6",
      category: "Financial Compliance",
      item: "Premium Payment Received",
      description: "First premium payment must be received",
      completed: true,
      dueDate: "2024-12-06",
      priority: "high",
    },
    {
      id: "7",
      category: "Financial Compliance",
      item: "GST Invoice Generated",
      description: "GST compliant invoice for premium",
      completed: false,
      dueDate: "2024-12-08",
      priority: "medium",
    },
    {
      id: "8",
      category: "IRDA Compliance",
      item: "Policy Number Assigned",
      description: "IRDA compliant policy number generated",
      completed: true,
      dueDate: "2024-12-06",
      priority: "high",
    },
    {
      id: "9",
      category: "IRDA Compliance",
      item: "Disclosure Statement Provided",
      description: "IRDA mandated disclosure statement given to customer",
      completed: false,
      dueDate: "2024-12-12",
      priority: "high",
    },
    {
      id: "10",
      category: "IRDA Compliance",
      item: "Free Look Period Notice",
      description: "30-day free look period notice provided",
      completed: true,
      dueDate: "2024-12-06",
      priority: "high",
    },
    {
      id: "11",
      category: "Document Archival",
      item: "Documents Scanned & Stored",
      description: "All documents digitally archived",
      completed: false,
      dueDate: "2024-12-20",
      priority: "medium",
    },
    {
      id: "12",
      category: "Document Archival",
      item: "Audit Trail Created",
      description: "Complete audit trail for policy creation",
      completed: true,
      dueDate: "2024-12-06",
      priority: "medium",
    },
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completionPercentage = Math.round((items.filter(i => i.completed).length / items.length) * 100);
  const categories = [...new Set(items.map(i => i.category))];
  const highPriorityPending = items.filter(i => !i.completed && i.priority === "high").length;

  const generateComplianceReport = () => {
    const report = items.map(item => 
      `${item.completed ? "✓" : "✗"} ${item.category} - ${item.item}: ${item.description}`
    ).join("\n");
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(report));
    element.setAttribute("download", "compliance-checklist.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✅</span> Compliance Checklist
            </CardTitle>
            <CardDescription>IRDA Regulatory Compliance Tracking</CardDescription>
          </div>
          <Button onClick={generateComplianceReport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {highPriorityPending > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">
              <strong>{highPriorityPending} high-priority items pending</strong> - Please complete these items to ensure compliance
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-3xl font-bold text-blue-600">{completionPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">{items.filter(i => i.completed).length}</p>
            <p className="text-xs text-gray-500 mt-1">of {items.length} items</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{items.filter(i => !i.completed).length}</p>
            <p className="text-xs text-gray-500 mt-1">items remaining</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">High Priority</p>
            <p className="text-3xl font-bold text-red-600">{highPriorityPending}</p>
            <p className="text-xs text-gray-500 mt-1">urgent items</p>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">{category}</h3>
              <div className="space-y-2 ml-2">
                {items.filter(i => i.category === category).map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <Checkbox 
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${item.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                          {item.item}
                        </p>
                        <Badge 
                          variant="outline"
                          className={
                            item.priority === "high" ? "bg-red-50 text-red-700 border-red-200" :
                            item.priority === "medium" ? "bg-orange-50 text-orange-700 border-orange-200" :
                            "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {item.priority}
                        </Badge>
                        {item.completed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
