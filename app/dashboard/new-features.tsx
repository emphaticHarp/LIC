"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerSegmentation } from "@/components/features/customer-segmentation";
import { PolicyComparison } from "@/components/features/policy-comparison";
import { LeadManagement } from "@/components/features/lead-management";
import { ExpenseManagement } from "@/components/features/expense-management";
import { MaturityBenefit } from "@/components/features/maturity-benefit";
import { GrievanceManagement } from "@/components/features/grievance-management";
import { DataAnalytics } from "@/components/features/data-analytics";

export function NewFeaturesPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="segmentation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 h-auto p-1 overflow-x-auto">
          <TabsTrigger value="segmentation" className="text-xs sm:text-sm py-2 px-2">
            Segmentation
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs sm:text-sm py-2 px-2">
            Policy Compare
          </TabsTrigger>
          <TabsTrigger value="leads" className="text-xs sm:text-sm py-2 px-2">
            Leads
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm py-2 px-2">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="maturity" className="text-xs sm:text-sm py-2 px-2">
            Maturity
          </TabsTrigger>
          <TabsTrigger value="grievance" className="text-xs sm:text-sm py-2 px-2">
            Grievance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 px-2">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="segmentation" className="space-y-4">
          <CustomerSegmentation />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <PolicyComparison />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <LeadManagement />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseManagement />
        </TabsContent>

        <TabsContent value="maturity" className="space-y-4">
          <MaturityBenefit />
        </TabsContent>

        <TabsContent value="grievance" className="space-y-4">
          <GrievanceManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DataAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
