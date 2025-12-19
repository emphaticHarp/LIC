# MongoDB Search Integration - Complete Guide

## 🎯 Overview

Successfully integrated the global search with MongoDB to search real data across all collections including customers, policies, claims, payments, agents, and loans.

---

## ✅ Changes Made

### 1. Updated Search API
**File**: `app/api/search/route.ts`

**Changes**:
- ✅ Connected to MongoDB using `connectDB()`
- ✅ Replaced mock data with real database queries
- ✅ Added support for 6 data types (Customer, Policy, Claim, Payment, Agent, Loan)
- ✅ Implemented advanced filtering (status, date range, premium range)
- ✅ Added regex-based search for case-insensitive matching
- ✅ Proper error handling and validation

### 2. Updated Global Search Component
**File**: `components/features/global-search.tsx`

**Changes**:
- ✅ Updated to handle new API response format
- ✅ Simplified result processing
- ✅ Better error handling

---

## 🔍 Search Capabilities

### Searchable Fields by Type

#### Customers
- Name
- Email
- Phone
- Customer ID
- City
- PAN Number

#### Policies
- Policy ID
- Customer Name
- Policy Type
- Category (life, health, vehicle, property)
- Premium Amount

#### Claims
- Claim ID
- Claimant Name
- Policy ID
- Claim Type
- Amount

#### Payments
- Transaction ID
- Customer Name
- Policy ID
- Amount
- Payment Method

#### Agents
- Name
- Email
- Phone
- Agent ID
- Total Commission

#### Loans
- Loan ID
- Full Name
- Email
- Phone
- Loan Amount
- EMI

---

## 🔧 API Endpoint Details

### GET `/api/search`

**Query Parameters**:
```
q              - Search query (required)
type           - Data type: all, customer, policy, claim, payment, agent, loan
status         - Filter by status: all, active, inactive, pending, approved, rejected
dateRange      - Filter by date: all, today, week, month, quarter, year
premiumRange   - Filter by premium: all, 0-10000, 10000-50000, 50000-100000, 100000+
limit          - Max results (default: 20)
```

**Example Request**:
```
GET /api/search?q=rajesh&type=customer&status=active&limit=20
```

**Response Format**:
```json
{
  "success": true,
  "results": {
    "customers": [...],
    "policies": [...],
    "claims": [...],
    "payments": [...],
    "agents": [...],
    "loans": [...]
  },
  "allResults": [...],
  "total": 15,
  "query": "rajesh",
  "type": "customer",
  "status": "active"
}
```

---

## 📊 Search Result Format

Each result includes:
```typescript
{
  _id: string;           // MongoDB ObjectId
  type: string;          // customer, policy, claim, payment, agent, loan
  title: string;         // Main identifier
  subtitle: string;      // Secondary info
  metadata: string;      // Additional details
  details: object;       // Full document from MongoDB
}
```

---

## 🎯 Usage Examples

### Search for Customer by Name
```
GET /api/search?q=rajesh&type=customer
```

### Search for Active Policies
```
GET /api/search?q=policy&type=policy&status=active
```

### Search for High Premium Policies
```
GET /api/search?q=&type=policy&premiumRange=100000+
```

### Search for Pending Claims
```
GET /api/search?q=&type=claim&status=pending
```

### Search for Recent Payments
```
GET /api/search?q=&type=payment&dateRange=week
```

### Search Across All Types
```
GET /api/search?q=rajesh&type=all
```

---

## 🔐 Security Features

1. **Input Validation**
   - Query parameter validation
   - Type checking
   - Limit enforcement

2. 