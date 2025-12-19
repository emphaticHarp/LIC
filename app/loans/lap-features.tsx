"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LAPApplicationForm } from "@/components/features/lap-application-form";
import { LAPEligibilityCalculator } from "@/components/features/lap-eligibility-calculator";
import { LAPManagement } from "@/components/features/lap-management";

export function LAPFeatures() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="application" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="application" className="text-xs sm:text-sm py-2 px-2">LAP Application</TabsTrigger>
          <TabsTrigger value="eligibility" className="text-xs sm:text-sm py-2 px-2">Eligibility Check</TabsTrigger>
          <TabsTrigger value="management" className="text-xs sm:text-sm py-2 px-2">LAP Management</TabsTrigger>
        </TabsList>

        <TabsContent value="application" className="space-y-4">
          <LAPApplicationForm />
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-4">
          <LAPEligibilityCalculator />
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <LAPManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
