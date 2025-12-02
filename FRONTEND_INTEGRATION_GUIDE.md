# Frontend Integration Guide

## Overview
New feature components have been created and are ready to be integrated into existing pages. Each component is self-contained and can be added as a tab to the existing pages.

---

## Components Created

### 1. **Customer Management** 
**File:** `components/features/customer-management.tsx`
**Component:** `CustomerManagementComponent`

**Features:**
- Search customers by name, email, phone
- Filter by status
- Create/Edit/Delete customers
- Pagination support
- API integration with `/api/customers`

**Integration into:** `/app/customers/page.tsx`

---

### 2. **Claims Management**
**File:** `components/features/claims-management.tsx`
**Component:** `ClaimsManagementComponent`

**Features:**
- Register new claims
- Filter by status
- View claim details
- Track claim progress
- API integration with `/api/claims`

**Integration into:** `/app/claims/page.tsx`

---

### 3. **Payments Management**
**File:** `components/features/payments-management.tsx`
**Component:** `PaymentsManagementComponent`

**Features:**
- Record payments
- Filter by status and date range
- View payment history
- Summary statistics (total, count, average)
- API integration with `/api/payments`

**Integration into:** `/app/payments/page.tsx`

---

### 4. **Reports & Analytics**
**File:** `components/features/reports-analytics.tsx`
**Component:** `ReportsAnalyticsComponent`

**Features:**
- Generate 5 types of reports:
  - Sales Report
  - Claims Report
  - Revenue Report
  - Agent Performance
  - Customer Analytics
- Date range filtering
- Download reports as JSON
- API integration with `/api/reports`

**Integration into:** `/app/reports/page.tsx`

---

### 5. **Commission Tracking**
**File:** `components/features/commission-tracking.tsx`
**Component:** `CommissionTrackingComponent`

**Features:**
- Create commission records
- Filter by status
- View commission details
- Summary statistics
- API integration with `/api/commission`

**Integration into:** `/app/commission/page.tsx`

---

### 6. **Collections Tracking**
**File:** `components/features/collections-tracking.tsx`
**Component:** `CollectionsTrackingComponent`

**Features:**
- Record collections
- Filter by status
- Track collection history
- Summary statistics
- API integration with `/api/collections`

**Integration into:** `/app/collections/page.tsx`

---

### 7. **Agent Tools**
**File:** `components/features/agent-tools.tsx`
**Component:** `AgentToolsComponent`

**Features:**
- Sales Pipeline (Kanban board)
- Lead management
- Task management
- Lead scoring
- Task statistics
- API integration with `/api/agent-tools`

**Integration into:** `/app/agent-management/page.tsx`

---

## Integration Steps

### Step 1: Import Component
```tsx
import { CustomerManagementComponent } from "@/components/features/customer-management";
```

### Step 2: Add as Tab Content
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing Tab</TabsTrigger>
    <TabsTrigger value="new-feature">New Feature</TabsTrigger>
  </TabsList>
  
  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>
  
  <TabsContent value="new-feature">
    <CustomerManagementComponent />
  </TabsContent>
</Tabs>
```

### Step 3: Update State Management
Each page already has `activeTab` state. Just add the new tab value:

```tsx
const [activeTab, setActiveTab] = useState("existing");
```

---

## Integration Examples

### Example 1: Add to Customers Page

**File:** `/app/customers/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerManagementComponent } from "@/components/features/customer-management";
import Navbar from "@/components/layout/navbar";

function CustomersPageContent() {
  const [activeTab, setActiveTab] = useState("existing");

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="existing">Existing View</TabsTrigger>
            <TabsTrigger value="api-management">API Management</TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            {/* Existing customer management code */}
          </TabsContent>

          <TabsContent value="api-management">
            <CustomerManagementComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersPageContent />
    </Suspense>
  );
}
```

### Example 2: Add to Claims Page

**File:** `/app/claims/page.tsx`

```tsx
import { ClaimsManagementComponent } from "@/components/features/claims-management";

// Inside ClaimsPageContent component:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing</TabsTrigger>
    <TabsTrigger value="api-claims">API Claims</TabsTrigger>
  </TabsList>

  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>

  <TabsContent value="api-claims">
    <ClaimsManagementComponent />
  </TabsContent>
</Tabs>
```

### Example 3: Add to Payments Page

**File:** `/app/payments/page.tsx`

```tsx
import { PaymentsManagementComponent } from "@/components/features/payments-management";

// Inside PaymentsPageContent component:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing</TabsTrigger>
    <TabsTrigger value="api-payments">API Payments</TabsTrigger>
  </TabsList>

  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>

  <TabsContent value="api-payments">
    <PaymentsManagementComponent />
  </TabsContent>
</Tabs>
```

### Example 4: Add to Reports Page

**File:** `/app/reports/page.tsx`

```tsx
import { ReportsAnalyticsComponent } from "@/components/features/reports-analytics";

// Inside ReportsPageContent component:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing</TabsTrigger>
    <TabsTrigger value="api-reports">API Reports</TabsTrigger>
  </TabsList>

  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>

  <TabsContent value="api-reports">
    <ReportsAnalyticsComponent />
  </TabsContent>
</Tabs>
```

### Example 5: Add to Commission Page

**File:** `/app/commission/page.tsx`

```tsx
import { CommissionTrackingComponent } from "@/components/features/commission-tracking";

// Inside CommissionPageContent component:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing</TabsTrigger>
    <TabsTrigger value="api-commission">API Commission</TabsTrigger>
  </TabsList>

  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>

  <TabsContent value="api-commission">
    <CommissionTrackingComponent />
  </TabsContent>
</Tabs>
```

### Example 6: Add to Collections Page

**File:** `/app/collections/page.tsx`

```tsx
import { CollectionsTrackingComponent } from "@/components/features/collections-tracking";

// Inside CollectionsPageContent component:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing</TabsTrigger>
    <TabsTrigger value="api-collections">API Collections</TabsTrigger>
  </TabsList>

  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>

  <TabsContent value="api-collections">
    <CollectionsTrackingComponent />
  </TabsContent>
</Tabs>
```

### Example 7: Add to Agent Management Page

**File:** `/app/agent-management/page.tsx`

```tsx
import { AgentToolsComponent } from "@/components/features/agent-tools";

// Inside AgentManagementPage component:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="existing">Existing</TabsTrigger>
    <TabsTrigger value="tools">Agent Tools</TabsTrigger>
  </TabsList>

  <TabsContent value="existing">
    {/* Existing content */}
  </TabsContent>

  <TabsContent value="tools">
    <AgentToolsComponent />
  </TabsContent>
</Tabs>
```

---

## Component Features Summary

| Component | Search | Filter | Create | Edit | Delete | Export | API |
|-----------|--------|--------|--------|------|--------|--------|-----|
| Customer | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| Claims | - | ✓ | ✓ | - | - | - | ✓ |
| Payments | - | ✓ | ✓ | - | - | - | ✓ |
| Reports | - | ✓ | - | - | - | ✓ | ✓ |
| Commission | - | ✓ | ✓ | - | - | - | ✓ |
| Collections | - | ✓ | ✓ | - | - | - | ✓ |
| Agent Tools | - | - | ✓ | - | - | - | ✓ |

---

## API Endpoints Used

Each component uses specific API endpoints:

- **Customer Management:** `/api/customers`
- **Claims Management:** `/api/claims`
- **Payments Management:** `/api/payments`
- **Reports Analytics:** `/api/reports`
- **Commission Tracking:** `/api/commission`
- **Collections Tracking:** `/api/collections`
- **Agent Tools:** `/api/agent-tools`

---

## Styling & UI

All components use:
- **shadcn/ui** components (Button, Card, Input, Dialog, etc.)
- **Tailwind CSS** for styling
- **Lucide icons** for icons
- Consistent color scheme with existing UI

---

## Error Handling

Each component includes:
- Try-catch blocks for API calls
- Loading states
- Error logging to console
- User-friendly error messages

---

## Performance Considerations

- Pagination support (10 items per page)
- Lazy loading of data
- Efficient state management
- Minimal re-renders

---

## Next Steps

1. **Copy integration code** from examples above
2. **Update page files** with new tab structure
3. **Test each component** with the API
4. **Verify data flow** between frontend and backend
5. **Deploy** to production

---

## Support

For issues or questions:
- Check component source files
- Review API documentation
- Check browser console for errors
- Verify MongoDB connection

---

**Last Updated:** December 2, 2025
**Version:** 1.0.0
