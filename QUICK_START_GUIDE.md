# Quick Start Guide - New Features

## Getting Started with LIC Insurance Management System v2.0

This guide will help you quickly get started with the newly implemented features.

---

## 1️⃣ Setup & Configuration

### Step 1: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 2: Configure Environment Variables
Create `.env.local` file:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lic
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### Step 3: Start Development Server
```bash
npm run dev
# or
yarn dev
```

Server will run at `http://localhost:3000`

---

## 2️⃣ Customer Management

### Create a Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "city": "Mumbai",
    "state": "Maharashtra",
    "panNumber": "ABCDE1234F",
    "aadhaarNumber": "123456789012",
    "agentId": "agent_001"
  }'
```

### Search Customers
```bash
# Search by name
curl "http://localhost:3000/api/customers?search=rajesh&limit=10"

# Filter by status
curl "http://localhost:3000/api/customers?status=active&page=1&limit=20"
```

---

## 3️⃣ Claims Management

### Register a Claim
```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "policyId": "POL123456",
    "customerId": "CUST001",
    "claimAmount": 100000,
    "claimType": "death_claim",
    "description": "Death benefit claim",
    "documents": ["doc_url_1", "doc_url_2"],
    "userId": "agent_001"
  }'
```

### Track Claims
```bash
# Get all claims
curl "http://localhost:3000/api/claims?page=1&limit=10"

# Filter by status
curl "http://localhost:3000/api/claims?status=under_review"

# Get customer's claims
curl "http://localhost:3000/api/claims?customerId=CUST001"
```

---

## 4️⃣ Payment Processing

### Record a Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "policyId": "POL123456",
    "amount": 5000,
    "paymentMethod": "credit_card",
    "dueDate": "2025-02-15",
    "description": "Monthly premium",
    "userId": "agent_001"
  }'
```

### Get Payment History
```bash
# All payments
curl "http://localhost:3000/api/payments?page=1&limit=20"

# By date range
curl "http://localhost:3000/api/payments?startDate=2025-01-01&endDate=2025-01-31"

# By status
curl "http://localhost:3000/api/payments?status=completed"
```

---

## 5️⃣ Reports & Analytics

### Generate Sales Report
```bash
curl "http://localhost:3000/api/reports?type=sales&startDate=2025-01-01&endDate=2025-01-31"
```

### Generate Claims Report
```bash
curl "http://localhost:3000/api/reports?type=claims&startDate=2025-01-01&endDate=2025-01-31"
```

### Generate Revenue Report
```bash
curl "http://localhost:3000/api/reports?type=revenue&startDate=2025-01-01&endDate=2025-01-31"
```

### Agent Performance Report
```bash
curl "http://localhost:3000/api/reports?type=agent_performance&startDate=2025-01-01&endDate=2025-01-31"
```

### Customer Analytics
```bash
curl "http://localhost:3000/api/reports?type=customer_analytics"
```

---

## 6️⃣ Commission Management

### Create Commission Record
```bash
curl -X POST http://localhost:3000/api/commission \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_001",
    "policyId": "POL123456",
    "policyPremium": 100000,
    "commissionRate": 10,
    "userId": "admin_001"
  }'
```

### Track Commissions
```bash
# All commissions
curl "http://localhost:3000/api/commission?page=1&limit=20"

# By agent
curl "http://localhost:3000/api/commission?agentId=agent_001"

# By status
curl "http://localhost:3000/api/commission?status=paid"
```

---

## 7️⃣ Collections Tracking

### Record Collection
```bash
curl -X POST http://localhost:3000/api/collections \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_001",
    "customerId": "CUST001",
    "policyId": "POL123456",
    "amount": 5000,
    "paymentMethod": "cash",
    "remarks": "Premium collected in person",
    "userId": "agent_001"
  }'
```

### View Collections
```bash
# By agent
curl "http://localhost:3000/api/collections?agentId=agent_001"

# By date range
curl "http://localhost:3000/api/collections?startDate=2025-01-01&endDate=2025-01-31"
```

---

## 8️⃣ Global Search

### Search Across All Entities
```bash
# Search for customer
curl "http://localhost:3000/api/search?q=rajesh&type=customers"

# Search for policy
curl "http://localhost:3000/api/search?q=POL123&type=policies"

# Global search
curl "http://localhost:3000/api/search?q=rajesh&type=all"
```

---

## 9️⃣ Communication Hub

### Send Email
```bash
curl -X POST http://localhost:3000/api/communication \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "type": "email",
    "templateId": "policy_approved",
    "recipientEmail": "rajesh@example.com",
    "variables": {
      "customerName": "Rajesh Kumar",
      "policyNumber": "POL123456"
    }
  }'
```

### Send SMS
```bash
curl -X POST http://localhost:3000/api/communication \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "type": "sms",
    "templateId": "payment_reminder",
    "recipientPhone": "9876543210",
    "variables": {
      "amount": "5000",
      "dueDate": "2025-02-15"
    }
  }'
```

### Create Email Template
```bash
curl -X POST http://localhost:3000/api/communication \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_template",
    "name": "Policy Renewal Reminder",
    "type": "email",
    "subject": "Your policy renewal is due",
    "body": "Dear {{customerName}}, your policy {{policyNumber}} is expiring on {{expiryDate}}. Please renew it to continue coverage.",
    "variables": ["customerName", "policyNumber", "expiryDate"]
  }'
```

---

## 🔟 Document Management

### Upload Document
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "upload",
    "fileName": "kyc_document.pdf",
    "fileType": "application/pdf",
    "fileSize": 2048,
    "fileUrl": "https://storage.com/kyc_document.pdf",
    "entityType": "customer",
    "entityId": "CUST001",
    "documentType": "KYC",
    "uploadedBy": "agent_001",
    "metadata": {"verified": true}
  }'
```

### Get Documents
```bash
curl "http://localhost:3000/api/documents?action=list&entityType=customer&entityId=CUST001"
```

### Log Document Access
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "log_access",
    "documentId": "DOC123",
    "accessedBy": "agent_001",
    "accessType": "download"
  }'
```

---

## 1️⃣1️⃣ Compliance & Audit

### Get Audit Logs
```bash
curl "http://localhost:3000/api/compliance?action=audit_logs&limit=100"

# For specific entity
curl "http://localhost:3000/api/compliance?action=audit_logs&entityType=Customer&entityId=CUST001"
```

### Generate KYC Report
```bash
curl -X POST http://localhost:3000/api/compliance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate_report",
    "type": "kyc",
    "generatedBy": "admin_001"
  }'
```

### Get KYC Status
```bash
curl "http://localhost:3000/api/compliance?action=kyc_status"
```

---

## 1️⃣2️⃣ Third-Party Integrations

### Process Payment
```bash
curl -X POST http://localhost:3000/api/integrations \
  -H "Content-Type: application/json" \
  -d '{
    "service": "payment",
    "action": "process",
    "amount": 5000,
    "paymentMethod": "credit_card",
    "customerId": "CUST001",
    "orderId": "ORD123"
  }'
```

### Calculate GST
```bash
curl -X POST http://localhost:3000/api/integrations \
  -H "Content-Type: application/json" \
  -d '{
    "service": "gst",
    "action": "calculate",
    "amount": 10000,
    "gstRate": 18
  }'
```

### Verify KYC
```bash
curl -X POST http://localhost:3000/api/integrations \
  -H "Content-Type: application/json" \
  -d '{
    "service": "kyc",
    "action": "verify",
    "panNumber": "ABCDE1234F",
    "aadhaarNumber": "123456789012",
    "name": "Rajesh Kumar"
  }'
```

### Send SMS
```bash
curl -X POST http://localhost:3000/api/integrations \
  -H "Content-Type: application/json" \
  -d '{
    "service": "communication",
    "action": "send_sms",
    "phoneNumber": "9876543210",
    "message": "Your OTP is 123456"
  }'
```

---

## 1️⃣3️⃣ Agent Tools

### Create Lead
```bash
curl -X POST http://localhost:3000/api/agent-tools \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_lead",
    "agentId": "agent_001",
    "customerName": "Priya Singh",
    "email": "priya@example.com",
    "phone": "9876543211",
    "value": 250000
  }'
```

### Get Agent Leads
```bash
curl "http://localhost:3000/api/agent-tools?tool=leads&agentId=agent_001"
```

### Create Task
```bash
curl -X POST http://localhost:3000/api/agent-tools \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_task",
    "agentId": "agent_001",
    "title": "Follow up with Priya",
    "description": "Call to discuss policy options",
    "dueDate": "2025-01-20",
    "priority": "high"
  }'
```

### Get Agent Tasks
```bash
curl "http://localhost:3000/api/agent-tools?tool=tasks&agentId=agent_001"
```

### Generate Quote
```bash
curl -X POST http://localhost:3000/api/agent-tools \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate_quote",
    "agentId": "agent_001",
    "customerId": "CUST002",
    "policyType": "term_life",
    "coverage": 500000,
    "term": 20
  }'
```

### Create Proposal
```bash
curl -X POST http://localhost:3000/api/agent-tools \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_proposal",
    "agentId": "agent_001",
    "customerId": "CUST002",
    "title": "Comprehensive Insurance Proposal",
    "items": [
      {
        "description": "Term Life Insurance - 20 years",
        "quantity": 1,
        "unitPrice": 5000,
        "total": 5000
      },
      {
        "description": "Critical Illness Cover",
        "quantity": 1,
        "unitPrice": 2000,
        "total": 2000
      }
    ]
  }'
```

---

## 📊 Common Workflows

### Workflow 1: New Customer Onboarding
```bash
# 1. Create customer
POST /api/customers

# 2. Upload KYC documents
POST /api/documents (action: upload)

# 3. Verify KYC
POST /api/integrations (service: kyc, action: verify)

# 4. Create lead
POST /api/agent-tools (action: create_lead)

# 5. Generate quote
POST /api/agent-tools (action: generate_quote)
```

### Workflow 2: Claim Processing
```bash
# 1. Register claim
POST /api/claims

# 2. Upload claim documents
POST /api/documents (action: upload)

# 3. Track claim status
GET /api/claims (filter by status)

# 4. Send notification
POST /api/communication (action: send)

# 5. Process payment
POST /api/integrations (service: payment)
```

### Workflow 3: Agent Performance Review
```bash
# 1. Get agent leads
GET /api/agent-tools?tool=leads

# 2. Get agent tasks
GET /api/agent-tools?tool=tasks

# 3. Generate agent report
GET /api/reports?type=agent_performance

# 4. View commissions
GET /api/commission?agentId=agent_001

# 5. View collections
GET /api/collections?agentId=agent_001
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running
- Verify network access in MongoDB Atlas

### API Returns 500 Error
- Check browser console for error details
- Verify all required fields are sent
- Check MongoDB connection

### Missing Data in Response
- Verify entity IDs are correct
- Check date formats (use ISO format: YYYY-MM-DD)
- Ensure user has proper permissions

---

## 📚 Additional Resources

- Full API Documentation: `API_DOCUMENTATION.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`
- GitHub Repository: https://github.com/emphaticHarp/LIC

---

## 💡 Tips & Best Practices

1. **Always include userId/agentId** in requests for audit logging
2. **Use date ranges** for better report accuracy
3. **Implement pagination** for large datasets
4. **Cache frequently accessed data** for performance
5. **Use search** before creating duplicate records
6. **Monitor audit logs** for compliance
7. **Test integrations** in development first
8. **Keep API keys secure** in environment variables

---

## 🆘 Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Review error messages carefully
3. Verify environment variables
4. Check MongoDB connection
5. Contact: support@lic-insurance.com

---

**Happy coding! 🚀**

**Last Updated:** December 2, 2025
**Version:** 2.0.0
