# Quick Feature Reference Guide

## Dashboard Features Quick Start

### 1. Tax Benefit Calculator
**Location**: Dashboard → Tax Benefits Tab
**What it does**: Calculates tax savings under Indian tax sections
**Key Features**:
- Section 80C (₹1,50,000 limit)
- Section 80D (Health Insurance)
- Section 80CCC (Pension Plans)
- Age-based calculations

**How to use**:
1. Enter annual premium amount
2. Select policy type
3. Enter age and annual income
4. Select tax bracket
5. Click "Calculate Tax Benefits"
6. View detailed breakdown

---

### 2. Compliance Checklist
**Location**: Dashboard → Compliance Tab
**What it does**: Tracks IRDA regulatory compliance requirements
**Key Features**:
- 12 compliance items across 4 categories
- Priority-based task management
- Completion tracking
- Export compliance reports

**How to use**:
1. Review all compliance items
2. Check off completed items
3. Monitor completion percentage
4. Export report for audit trail

---

### 3. Surrender Value Calculator
**Location**: Dashboard → Surrender Tab
**What it does**: Calculates policy surrender value as per IRDA guidelines
**Key Features**:
- IRDA-compliant calculations
- Support for multiple policy types
- Bonus value calculation
- Premium loss analysis

**How to use**:
1. Enter sum assured
2. Enter annual premium
3. Select policy term
4. Enter years completed
5. Select policy type
6. Click "Calculate Surrender Value"

---

### 4. Audit Trail
**Location**: Dashboard → Audit Trail Tab
**What it does**: Logs all system transactions and user activities
**Key Features**:
- Complete action logging
- User activity tracking
- Advanced filtering
- CSV export capability

**How to use**:
1. Search by user email
2. Filter by action type
3. Filter by entity type
4. Filter by status
5. Export audit log

---

### 5. Policy Lapse Prevention Alerts
**Location**: Dashboard → Lapse Alerts Tab
**What it does**: Monitors and prevents policy lapses
**Key Features**:
- Real-time risk monitoring
- Multi-channel communication
- Risk level classification
- Communication tracking

**How to use**:
1. View policies at risk
2. Send reminders via Email/SMS/WhatsApp
3. Track communication history
4. Monitor days until lapse

---

### 6. Advanced Search & Filtering
**Location**: Dashboard → Search Tab
**What it does**: Full-text search across all system entities
**Key Features**:
- Search policies, customers, claims, payments
- Advanced filtering options
- Save search filters
- Search history

**How to use**:
1. Enter search query
2. Select entity type
3. Apply filters (status, date range, premium)
4. View results
5. Save search for future use

---

## Loans Page - LAP Features

### 1. LAP Application Form
**Location**: Loans → LAP Application Tab
**What it does**: Apply for Loan Against Policy
**Key Features**:
- Automatic EMI calculation
- Bank account validation
- Form validation
- Instant approval

**How to use**:
1. Enter policy ID
2. Enter sum assured and loan amount
3. Select loan purpose and term
4. Enter bank details
5. Submit application
6. Get instant approval with EMI details

---

### 2. LAP Eligibility Calculator
**Location**: Loans → Eligibility Check Tab
**What it does**: Check if you're eligible for LAP
**Key Features**:
- Eligibility criteria validation
- Maximum loan amount calculation
- Interest rate determination
- Detailed eligibility report

**How to use**:
1. Enter policy term
2. Enter years completed
3. Enter sum assured
4. Enter annual premium
5. Select policy status
6. Click "Check Eligibility"
7. View eligibility status and max loan amount

---

### 3. LAP Management Dashboard
**Location**: Loans → LAP Management Tab
**What it does**: Track all LAP loans and EMI payments
**Key Features**:
- Active loan tracking
- EMI schedule generation
- Repayment progress monitoring
- Disbursement status

**How to use**:
1. View active loans
2. Check EMI details
3. Download EMI schedule
4. Track repayment progress
5. View completed loans

---

## API Endpoints Reference

### Audit Logs
```
GET /api/audit-logs?action=CREATE&entity=Policy&status=success
POST /api/audit-logs
```

### LAP Management
```
GET /api/lap?policyId=LIC-123456789
POST /api/lap
PUT /api/lap
```

### Compliance
```
GET /api/compliance?policyId=LIC-123456789
POST /api/compliance
PUT /api/compliance
```

### Lapse Alerts
```
GET /api/lapse-alerts?riskLevel=critical
POST /api/lapse-alerts
PUT /api/lapse-alerts
```

### Search
```
GET /api/search?q=LIC-123&type=policy&status=active
POST /api/search (save search)
```

---

## Key Calculations

### Tax Benefit Calculation
```
Section 80C Deduction = Min(Premium, ₹1,50,000)
Tax Savings = Total Deduction × Tax Rate
Effective Premium = Premium - Tax Savings
```

### Surrender Value Calculation
```
Years < 1: 0%
Years 1-3: 30% of premium paid
Years 3-5: 50% of premium paid
Years 5-10: 75% of premium paid
Years 10+: 90% of premium paid
```

### LAP Eligibility
```
Max Loan Amount = Surrender Value × 80%
Monthly EMI = (Loan Amount × Monthly Rate × (1 + Monthly Rate)^Term) / ((1 + Monthly Rate)^Term - 1)
```

---

## Common Tasks

### Task: Generate Compliance Report
1. Go to Dashboard → Compliance Tab
2. Review all items
3. Click "Export Report"
4. Save PDF/CSV file

### Task: Check Policy Lapse Risk
1. Go to Dashboard → Lapse Alerts Tab
2. View policies by risk level
3. Send reminders to customers
4. Track communication

### Task: Apply for LAP
1. Go to Loans → LAP Application Tab
2. Fill application form
3. Submit
4. Get instant approval
5. Download EMI schedule

### Task: Search for Policy
1. Go to Dashboard → Search Tab
2. Enter policy ID or customer name
3. Apply filters
4. View results
5. Save search for future

---

## Tips & Best Practices

1. **Tax Planning**: Use tax calculator annually to optimize insurance purchases
2. **Compliance**: Review compliance checklist before policy issuance
3. **Lapse Prevention**: Send reminders 15 days before premium due date
4. **LAP**: Check eligibility before applying for loan
5. **Audit**: Review audit trail monthly for compliance

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Calculation not showing | Ensure all required fields are filled |
| LAP not eligible | Policy must be active for 3+ years |
| Search not working | Check search query and filters |
| Compliance items not updating | Refresh page and try again |
| Lapse alert not sending | Check email/SMS configuration |

---

## Support

For issues or questions:
1. Check this guide first
2. Review FEATURE_INTEGRATION_GUIDE.md
3. Check API documentation
4. Contact support team

---

Last Updated: December 6, 2024
