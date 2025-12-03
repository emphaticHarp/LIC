# MongoDB Setup Guide

## 🗄️ MongoDB Connection Configuration

Your LIC Insurance Management System is fully configured to use MongoDB for all functionality.

---

## 📋 Environment Setup

### Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster or use existing one
3. Click "Connect"
4. Choose "Drivers" → "Node.js"
5. Copy the connection string

### Step 2: Set Environment Variable

Create or update `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lic_database?retryWrites=true&w=majority
```

**Replace:**
- `username` - Your MongoDB username
- `password` - Your MongoDB password
- `cluster` - Your cluster name
- `lic_database` - Your database name

---

## ✅ Verification

### Check Connection

Run this command to verify MongoDB connection:

```bash
npm run dev
```

Look for successful connection message in console.

### Test API Endpoints

All API endpoints use MongoDB:

```bash
# Test customer endpoint
curl http://localhost:3000/api/customers

# Test claims endpoint
curl http://localhost:3000/api/claims

# Test payments endpoint
curl http://localhost:3000/api/payments
```

---

## 📊 MongoDB Collections

The system automatically creates these collections:

### 1. **users**
- User authentication and profiles
- Email, password, role, profile info

### 2. **customers**
- Customer information
- Contact details, KYC data, policies

### 3. **policies**
- Insurance policies
- Policy details, coverage, premiums

### 4. **claims**
- Insurance claims
- Claim status, documents, amounts

### 5. **payments**
- Payment records
- Transaction details, status, methods

### 6. **commissions**
- Agent commissions
- Commission amounts, status, calculations

### 7. **collections**
- Collection records
- Collection status, amounts, dates

### 8. **audit_logs**
- System audit trail
- User actions, timestamps, changes

### 9. **communication_templates**
- Email/SMS/WhatsApp templates
- Template content, variables

### 10. **communication_logs**
- Communication history
- Sent messages, delivery status

### 11. **workflows**
- Workflow definitions
- Actions, triggers, conditions

### 12. **workflow_executions**
- Workflow execution history
- Status, results, timestamps

### 13. **documents**
- Document storage metadata
- File info, access logs, versions

### 14. **document_access_logs**
- Document access tracking
- User access, timestamps

### 15. **document_versions**
- Document version history
- Version info, changes

---

## 🔐 Security Best Practices

### 1. **Never Commit .env.local**
```bash
# .gitignore already includes:
.env.local
.env.*.local
```

### 2. **Use Strong Passwords**
- MongoDB password should be strong
- Use special characters, numbers, uppercase

### 3. **IP Whitelist**
- In MongoDB Atlas, add your IP to whitelist
- Or use 0.0.0.0/0 for development only

### 4. **Environment Variables**
- Never hardcode connection strings
- Use environment variables only

### 5. **Database User Permissions**
- Create separate user for application
- Grant only necessary permissions

---

## 🚀 API Endpoints Using MongoDB

All these endpoints use MongoDB:

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Claims
- `GET /api/claims` - List claims
- `POST /api/claims` - Create claim
- `PUT /api/claims/:id` - Update claim

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment

### Reports
- `GET /api/reports` - Generate reports
- `POST /api/reports` - Create report

### Commission
- `GET /api/commission` - List commissions
- `POST /api/commission` - Create commission

### Collections
- `GET /api/collections` - List collections
- `POST /api/collections` - Record collection

### Search
- `GET /api/search` - Global search

### Communication
- `GET /api/communication` - List templates/logs
- `POST /api/communication` - Send message

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document

### Compliance
- `GET /api/compliance` - Get audit logs
- `POST /api/compliance` - Generate reports

### Integrations
- `POST /api/integrations` - Process integrations

### Agent Tools
- `GET /api/agent-tools` - Get leads/tasks
- `POST /api/agent-tools` - Create leads/tasks

---

## 🔧 Connection Details

### File: `/lib/db.ts`

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  // Connection logic
}
```

### Usage in API Routes

All API routes use this pattern:

```typescript
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Your database operations
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 📝 Frontend Data Flow

### Pages Using MongoDB (via APIs)

1. **Customers Page** - Fetches from `/api/customers`
2. **Claims Page** - Fetches from `/api/claims`
3. **Payments Page** - Fetches from `/api/payments`
4. **Reports Page** - Fetches from `/api/reports`
5. **Commission Page** - Fetches from `/api/commission`
6. **Collections Page** - Fetches from `/api/collections`
7. **Agent Management** - Fetches from `/api/agent-tools`
8. **Dashboard** - Fetches from multiple APIs

### Data Storage

All data is stored in MongoDB:
- ✅ User data
- ✅ Customer information
- ✅ Policies
- ✅ Claims
- ✅ Payments
- ✅ Commissions
- ✅ Collections
- ✅ Audit logs
- ✅ Documents
- ✅ Communications

---

## 🐛 Troubleshooting

### Connection Error: "MONGODB_URI not defined"

**Solution:** Add `MONGODB_URI` to `.env.local`

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### Connection Timeout

**Solution:** 
1. Check MongoDB Atlas is running
2. Verify IP is whitelisted
3. Check network connection

### Authentication Failed

**Solution:**
1. Verify username and password
2. Check special characters are URL encoded
3. Verify user has database access

### Database Not Found

**Solution:**
1. Create database in MongoDB Atlas
2. Update connection string with correct database name

---

## 📊 Monitoring

### Check MongoDB Connection Status

```bash
# In browser console
fetch('/api/customers')
  .then(r => r.json())
  .then(d => console.log(d))
```

### View Logs

```bash
# Terminal
npm run dev
# Look for connection messages
```

---

## 🔄 Data Sync

All pages automatically sync with MongoDB:

1. **On Load** - Fetches latest data from MongoDB
2. **On Create** - Saves to MongoDB
3. **On Update** - Updates in MongoDB
4. **On Delete** - Removes from MongoDB
5. **Real-time** - Uses API for all operations

---

## ✨ Features Using MongoDB

- ✅ Customer management
- ✅ Policy management
- ✅ Claims processing
- ✅ Payment tracking
- ✅ Commission calculation
- ✅ Collections tracking
- ✅ Audit logging
- ✅ Document management
- ✅ Communication templates
- ✅ Workflow automation
- ✅ Compliance reporting
- ✅ Third-party integrations

---

## 📚 Resources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created
- [ ] Connection string copied
- [ ] `.env.local` file created
- [ ] `MONGODB_URI` added to `.env.local`
- [ ] Application started (`npm run dev`)
- [ ] APIs tested
- [ ] Data persisting in MongoDB

---

**Your LIC Insurance Management System is fully configured for MongoDB!**

**Last Updated:** December 2, 2025
**Status:** ✅ Production Ready
