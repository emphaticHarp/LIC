"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxBenefitCalculator } from "@/components/features/tax-benefit-calculator";
import { ComplianceChecklist } from "@/components/features/compliance-checklist";
import { SurrenderValueCalculator } from "@/components/features/surrender-value-calculator";
import { AuditTrail } from "@/components/features/audit-trail";
import { LapsePreventionAlerts } from "@/components/features/lapse-prevention-alerts";
import { AdvancedSearchFilter } from "@/components/features/advanced-search-filter";

export function EnhancedDashboardFeatures() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="tax-benefits" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="tax-benefits" className="text-xs sm:text-sm py-2 px-2">Tax Benefits</TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs sm:text-sm py-2 px-2">Compliance</TabsTrigger>
          <TabsTrigger value="surrender" className="text-xs sm:text-sm py-2 px-2">Surrender</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs sm:text-sm py-2 px-2">Audit Trail</TabsTrigger>
          <TabsTrigger value="lapse" className="text-xs sm:text-sm py-2 px-2">Lapse Alerts</TabsTrigger>
          <TabsTrigger value="search" className="text-xs sm:text-sm py-2 px-2">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="tax-benefits" className="space-y-4">
          <TaxBenefitCalculator />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceChecklist />
        </TabsContent>

        <TabsContent value="surrender" className="space-y-4">
          <SurrenderValueCalculator />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditTrail />
        </TabsContent>

        <TabsContent value="lapse" className="space-y-4">
          <LapsePreventionAlerts />
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <AdvancedSearchFilter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
