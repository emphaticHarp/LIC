# LIC Insurance Management System - API Documentation

## New Features Implementation

This document outlines all the new API endpoints and features added to the LIC Insurance Management System.

---

## 1. Customer Management API

### GET `/api/customers`
Fetch customers with advanced search and filtering.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 10)
- `search` (string): Search by name, email, phone, or customerId
- `status` (string): Filter by status (active, inactive, suspended)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): asc or desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### POST `/api/customers`
Create a new customer.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "panNumber": "ABCDE1234F",
  "aadhaarNumber": "123456789012",
  "agentId": "agent_id"
}
```

---

## 2. Claims Management API

### GET `/api/claims`
Fetch claims with filtering.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `status` (string): Filter by status
- `customerId` (string): Filter by customer
- `policyId` (string): Filter by policy

### POST `/api/claims`
Create a new claim.

**Request Body:**
```json
{
  "policyId": "policy_id",
  "customerId": "customer_id",
  "claimAmount": 50000,
  "claimType": "death_claim",
  "description": "Claim description",
  "documents": ["doc_url_1", "doc_url_2"],
  "userId": "user_id"
}
```

---

## 3. Payments API

### GET `/api/payments`
Fetch payments with date range filtering.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `status` (string): pending, completed, failed, refunded
- `customerId` (string): Filter by customer
- `policyId` (string): Filter by policy
- `startDate` (string): ISO date format
- `endDate` (string): ISO date format

**Response includes:**
- `totalAmount`: Sum of all payments matching criteria

### POST `/api/payments`
Create a new payment.

**Request Body:**
```json
{
  "customerId": "customer_id",
  "policyId": "policy_id",
  "amount": 5000,
  "paymentMethod": "credit_card",
  "dueDate": "2025-01-15",
  "description": "Premium payment",
  "userId": "user_id"
}
```

---

## 4. Reports API

### GET `/api/reports`
Generate various reports.

**Query Parameters:**
- `type` (string): sales, claims, revenue, agent_performance, customer_analytics
- `startDate` (string): ISO date format
- `endDate` (string): ISO date format
- `agentId` (string): For agent-specific reports

**Report Types:**

#### Sales Report
```json
{
  "type": "sales",
  "period": { "startDate": "...", "endDate": "..." },
  "summary": {
    "totalPolicies": 150,
    "totalPremium": 5000000
  },
  "details": [...]
}
```

#### Claims Report
```json
{
  "type": "claims",
  "summary": {
    "totalClaims": 25,
    "totalClaimAmount": 1000000
  },
  "byStatus": [...]
}
```

#### Revenue Report
```json
{
  "type": "revenue",
  "summary": {
    "totalTransactions": 500,
    "totalRevenue": 2500000
  },
  "byPaymentMethod": [...]
}
```

#### Agent Performance Report
```json
{
  "type": "agent_performance",
  "topAgents": [
    {
      "_id": "agent_id",
      "policiesSold": 50,
      "totalPremium": 500000,
      "avgPremium": 10000
    }
  ]
}
```

---

## 5. Commission Management API

### GET `/api/commission`
Fetch commissions with filtering.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `agentId` (string): Filter by agent
- `status` (string): pending, calculated, approved, paid
- `startDate` (string): ISO date format
- `endDate` (string): ISO date format

**Response includes:**
- `totalCommission`: Sum of all commissions

### POST `/api/commission`
Create a new commission record.

**Request Body:**
```json
{
  "agentId": "agent_id",
  "policyId": "policy_id",
  "policyPremium": 100000,
  "commissionRate": 10,
  "userId": "user_id"
}
```

---

## 6. Collections API

### GET `/api/collections`
Fetch collection records.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `agentId` (string): Filter by agent
- `customerId` (string): Filter by customer
- `status` (string): collected, pending, failed
- `startDate` (string): ISO date format
- `endDate` (string): ISO date format

### POST `/api/collections`
Create a new collection record.

**Request Body:**
```json
{
  "agentId": "agent_id",
  "customerId": "customer_id",
  "policyId": "policy_id",
  "amount": 5000,
  "paymentMethod": "cash",
  "remarks": "Collection remarks",
  "userId": "user_id"
}
```

---

## 7. Advanced Search API

### GET `/api/search`
Global search across all entities.

**Query Parameters:**
- `q` (string): Search query (minimum 2 characters)
- `type` (string): all, customers, policies, claims, payments
- `limit` (int): Results per entity (default: 20)

**Response:**
```json
{
  "success": true,
  "query": "search_term",
  "results": {
    "customers": [...],
    "policies": [...],
    "claims": [...],
    "payments": [...]
  }
}
```

---

## 8. Communication Hub API

### GET `/api/communication`
Fetch communication templates or logs.

**Query Parameters:**
- `action` (string): templates or logs
- `type` (string): email, sms, whatsapp (for templates)
- `page` (int): Page number (for logs)
- `limit` (int): Items per page (for logs)

### POST `/api/communication`
Send communication or create templates.

**Send Communication:**
```json
{
  "action": "send",
  "type": "email",
  "templateId": "template_id",
  "recipientId": "customer_id",
  "recipientEmail": "customer@example.com",
  "variables": {
    "customerName": "John Doe",
    "policyNumber": "POL123"
  }
}
```

**Create Template:**
```json
{
  "action": "create_template",
  "name": "Policy Renewal Reminder",
  "type": "email",
  "subject": "Your policy renewal is due",
  "body": "Dear {{customerName}}, your policy {{policyNumber}} is expiring soon...",
  "variables": ["customerName", "policyNumber"]
}
```

---

## 9. Document Management API

### GET `/api/documents`
Fetch documents for an entity.

**Query Parameters:**
- `action` (string): list or access_logs
- `entityType` (string): customer, policy, claim, etc.
- `entityId` (string): ID of the entity
- `documentType` (string): KYC, Policy, Claim, etc.
- `documentId` (string): For access logs

### POST `/api/documents`
Upload or manage documents.

**Upload Document:**
```json
{
  "action": "upload",
  "fileName": "kyc_document.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048,
  "fileUrl": "https://storage.com/file.pdf",
  "entityType": "customer",
  "entityId": "customer_id",
  "documentType": "KYC",
  "uploadedBy": "user_id",
  "metadata": { "verified": true }
}
```

**Log Document Access:**
```json
{
  "action": "log_access",
  "documentId": "doc_id",
  "accessedBy": "user_id",
  "accessType": "download",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

---

## 10. Compliance & Audit API

### GET `/api/compliance`
Fetch compliance data and audit logs.

**Query Parameters:**
- `action` (string): audit_logs, reports, kyc_status
- `type` (string): kyc, aml, gdpr, data_retention, audit_trail
- `entityType` (string): For audit logs
- `entityId` (string): For audit logs
- `page` (int): Page number
- `limit` (int): Items per page

### POST `/api/compliance`
Generate compliance reports.

**Request Body:**
```json
{
  "action": "generate_report",
  "type": "kyc",
  "generatedBy": "admin_id"
}
```

**Report Types:**
- `kyc`: KYC compliance status
- `aml`: Anti-Money Laundering report
- `gdpr`: GDPR compliance report
- `data_retention`: Data retention policies
- `audit_trail`: Audit trail report

---

## 11. Integrations API

### POST `/api/integrations`
Handle third-party integrations.

**Payment Processing:**
```json
{
  "service": "payment",
  "action": "process",
  "amount": 5000,
  "paymentMethod": "credit_card",
  "customerId": "customer_id",
  "orderId": "order_id"
}
```

**GST Calculation:**
```json
{
  "service": "gst",
  "action": "calculate",
  "amount": 10000,
  "gstRate": 18
}
```

**KYC Verification:**
```json
{
  "service": "kyc",
  "action": "verify",
  "panNumber": "ABCDE1234F",
  "aadhaarNumber": "123456789012",
  "name": "John Doe"
}
```

**Video KYC:**
```json
{
  "service": "kyc",
  "action": "initiate_video_kyc",
  "customerId": "customer_id",
  "email": "customer@example.com"
}
```

**Bank Verification:**
```json
{
  "service": "bank",
  "action": "verify",
  "accountNumber": "1234567890",
  "ifscCode": "SBIN0001234",
  "accountHolderName": "John Doe"
}
```

**Send SMS:**
```json
{
  "service": "communication",
  "action": "send_sms",
  "phoneNumber": "9876543210",
  "message": "Your OTP is 123456"
}
```

**Send Email:**
```json
{
  "service": "communication",
  "action": "send_email",
  "email": "user@example.com",
  "subject": "Policy Notification",
  "message": "Your policy has been approved"
}
```

**Send WhatsApp:**
```json
{
  "service": "communication",
  "action": "send_whatsapp",
  "phoneNumber": "9876543210",
  "message": "Your policy details are attached",
  "templateId": "template_id"
}
```

---

## 12. Agent Tools API

### GET `/api/agent-tools`
Fetch agent's leads and tasks.

**Query Parameters:**
- `tool` (string): leads or tasks
- `agentId` (string): Agent ID

**Leads Response:**
```json
{
  "success": true,
  "leads": [...],
  "pipeline": {
    "prospect": 10,
    "contacted": 5,
    "qualified": 3,
    "proposal": 2,
    "negotiation": 1,
    "closed": 0
  },
  "totalValue": 500000
}
```

**Tasks Response:**
```json
{
  "success": true,
  "tasks": [...],
  "byStatus": {
    "todo": 5,
    "in_progress": 2,
    "completed": 10
  },
  "overdue": 1
}
```

### POST `/api/agent-tools`
Create leads, tasks, quotes, and proposals.

**Create Lead:**
```json
{
  "action": "create_lead",
  "agentId": "agent_id",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "value": 100000
}
```

**Update Lead Stage:**
```json
{
  "action": "update_lead_stage",
  "leadId": "lead_id",
  "newStage": "proposal"
}
```

**Create Task:**
```json
{
  "action": "create_task",
  "agentId": "agent_id",
  "title": "Follow up with customer",
  "description": "Call customer to discuss policy",
  "dueDate": "2025-01-20",
  "priority": "high"
}
```

**Generate Quote:**
```json
{
  "action": "generate_quote",
  "agentId": "agent_id",
  "customerId": "customer_id",
  "policyType": "term_life",
  "coverage": 500000,
  "term": 20
}
```

**Create Proposal:**
```json
{
  "action": "create_proposal",
  "agentId": "agent_id",
  "customerId": "customer_id",
  "title": "Insurance Proposal",
  "items": [
    {
      "description": "Term Life Insurance",
      "quantity": 1,
      "unitPrice": 5000,
      "total": 5000
    }
  ]
}
```

---

## Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Server Error

---

## Authentication

All API endpoints require authentication. Include the user ID in the request:
- Via header: `Authorization: Bearer token`
- Via body: `userId` field

---

## Rate Limiting

- Standard: 100 requests per minute
- Premium: 1000 requests per minute

---

## Pagination

Default pagination:
- `page`: 1
- `limit`: 10
- Maximum limit: 100

---

## Sorting

Available sort fields vary by endpoint. Common ones:
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `name`: Entity name
- `amount`: Monetary amount

Sort order:
- `asc`: Ascending
- `desc`: Descending (default)

---

## Examples

### Example 1: Create a customer and fetch their data
```bash
# Create customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "agentId": "agent_123"
  }'

# Fetch customers
curl http://localhost:3000/api/customers?search=john&limit=10
```

### Example 2: Generate a sales report
```bash
curl "http://localhost:3000/api/reports?type=sales&startDate=2025-01-01&endDate=2025-01-31"
```

### Example 3: Send a communication
```bash
curl -X POST http://localhost:3000/api/communication \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "type": "email",
    "templateId": "renewal_reminder",
    "recipientEmail": "customer@example.com",
    "variables": {
      "customerName": "John Doe",
      "policyNumber": "POL123"
    }
  }'
```

---

## Support

For issues or questions, contact: support@lic-insurance.com

---

**Last Updated:** December 2, 2025
**Version:** 2.0.0
