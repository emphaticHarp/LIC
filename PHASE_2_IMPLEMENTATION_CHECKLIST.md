# Phase 2 Implementation Checklist

## Overview
This checklist guides the implementation of improvements to each page. Use this as a reference when updating pages.

---

## Template for Each Page Update

### Step 1: Import Required Modules
```typescript
// Validation
import { validateCustomerForm, validateClaimForm, validatePolicyForm } from '@/lib/validation';

// Storage
import { storage } from '@/lib/storage';

// Toast
import { toast } from '@/lib/toast';

// Hooks
import { useFormState } from '@/hooks/useFormState';
import { useApi } from '@/hooks/useApi';

// Components
import { FormError } from '@/components/ui/form-error';
import { Skeleton, TableSkeleton, FormSkeleton } from '@/components/ui/skeleton';
import { DocumentUpload } from '@/components/features/document-upload';
import { SearchFilter } from '@/components/features/search-filter';
```

### Step 2: Replace Mock Data with API Calls
- [ ] Remove hardcoded mock data arrays
- [ ] Replace with API calls using `useApi` hook
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add pagination support

### Step 3: Add Form Validation
- [ ] Import appropriate validation function
- [ ] Use `useFormState` hook with validation
- [ ] Display field-level errors using `FormError`
- [ ] Add red borders to invalid fields
- [ ] Prevent submission if validation fails

### Step 4: Implement LocalStorage Persistence
- [ ] Add `storageKey` to `useFormState`
- [ ] Form data auto-saves on change
- [ ] Form data auto-loads on mount
- [ ] Add clear button to reset form

### Step 5: Add Toast Notifications
- [ ] Success toast on create/update/delete
- [ ] Error toast on API failure
- [ ] Warning toast for validation errors
- [ ] Info toast for important messages

### Step 6: Use DocumentUpload Component
- [ ] Replace file input with `DocumentUpload`
- [ ] Set appropriate `maxFiles` and `maxFileSize`
- [ ] Handle document changes
- [ ] Display uploaded documents

### Step 7: Use SearchFilter Component
- [ ] Replace individual filter inputs with `SearchFilter`
- [ ] Define filter options
- [ ] Handle search and filter changes
- [ ] Implement clear filters functionality

### Step 8: Add Loading Skeletons
- [ ] Show `TableSkeleton` while loading list
- [ ] Show `FormSkeleton` while loading form
- [ ] Show `Skeleton` for individual items
- [ ] Smooth transition from skeleton to content

### Step 9: Add Error Handling
- [ ] Catch API errors
- [ ] Display user-friendly error messages
- [ ] Provide retry functionality
- [ ] Log errors for debugging

### Step 10: Test Everything
- [ ] Form validation works
- [ ] MongoDB CRUD operations work
- [ ] LocalStorage persistence works
- [ ] Toast notifications display
- [ ] Document upload works
- [ ] Search and filtering work
- [ ] Loading states display
- [ ] Error handling works
- [ ] Mobile responsive design works

---

## Page-Specific Checklists

### app/customers/page.tsx

#### Data Fetching
- [ ] Replace mock customers array with API call
- [ ] Use `useApi` hook for GET /api/customers
- [ ] Add pagination support
- [ ] Add search and filtering
- [ ] Handle loading state with `TableSkeleton`
- [ ] Handle error state with user message

#### Form Validation
- [ ] Use `validateCustomerForm` for validation
- [ ] Display field-level errors
- [ ] Prevent submission if invalid
- [ ] Clear errors on input change

#### LocalStorage
- [ ] Save form data to localStorage
- [ ] Load form data on mount
- [ ] Clear on successful submission
- [ ] Use storageKey: 'customer_form'

#### Document Upload
- [ ] Add DocumentUpload for KYC documents
- [ ] Set maxFiles: 5
- [ ] Set maxFileSize: 10
- [ ] Accept: PDF, JPG, PNG

#### Search & Filter
- [ ] Implement SearchFilter component
- [ ] Add filters: Status, KYC Status, Date Range
- [ ] Handle search term changes
- [ ] Handle filter changes
- [ ] Implement clear filters

#### Toast Notifications
- [ ] Success: "Customer created successfully"
- [ ] Success: "Customer updated successfully"
- [ ] Success: "Customer deleted successfully"
- [ ] Error: "Failed to create customer"
- [ ] Error: "Failed to update customer"
- [ ] Error: "Failed to delete customer"
- [ ] Warning: "Please check all fields"

#### Testing
- [ ] Create new customer
- [ ] Update existing customer
- [ ] Delete customer
- [ ] Search customers
- [ ] Filter by status
- [ ] Filter by KYC status
- [ ] Upload KYC documents
- [ ] Form persists on refresh
- [ ] Mobile responsive

---

### app/claims/page.tsx

#### Data Fetching
- [ ] Replace mock claims array with API call
- [ ] Use `useApi` hook for GET /api/claims
- [ ] Add pagination support
- [ ] Add search and filtering
- [ ] Handle loading state with `TableSkeleton`
- [ ] Handle error state with user message

#### Form Validation
- [ ] Use `validateClaimForm` for validation
- [ ] Display field-level errors
- [ ] Prevent submission if invalid
- [ ] Clear errors on input change

#### LocalStorage
- [ ] Save form data to localStorage
- [ ] Load form data on mount
- [ ] Clear on successful submission
- [ ] Use storageKey: 'claim_form'

#### Document Upload
- [ ] Add DocumentUpload for claim documents
- [ ] Set maxFiles: 10
- [ ] Set maxFileSize: 10
- [ ] Accept: PDF, JPG, PNG, DOC, DOCX

#### Search & Filter
- [ ] Implement SearchFilter component
- [ ] Add filters: Status, Claim Type, Date Range, Amount Range
- [ ] Handle search term changes
- [ ] Handle filter changes
- [ ] Implement clear filters

#### Toast Notifications
- [ ] Success: "Claim filed successfully"
- [ ] Success: "Claim updated successfully"
- [ ] Success: "Claim deleted successfully"
- [ ] Error: "Failed to file claim"
- [ ] Error: "Failed to update claim"
- [ ] Error: "Failed to delete claim"
- [ ] Warning: "Please check all fields"

#### Testing
- [ ] File new claim
- [ ] Update existing claim
- [ ] Delete claim
- [ ] Search claims
- [ ] Filter by status
- [ ] Filter by claim type
- [ ] Upload claim documents
- [ ] Form persists on refresh
- [ ] Mobile responsive

---

### app/policies/page.tsx

#### Data Fetching
- [ ] Replace mock policies array with API call
- [ ] Use `useApi` hook for GET /api/policies
- [ ] Add pagination support
- [ ] Add search and filtering
- [ ] Handle loading state with `TableSkeleton`
- [ ] Handle error state with user message

#### Form Validation
- [ ] Use `validatePolicyForm` for validation
- [ ] Display field-level errors
- [ ] Prevent submission if invalid
- [ ] Clear errors on input change

#### LocalStorage
- [ ] Save form data to localStorage
- [ ] Load form data on mount
- [ ] Clear on successful submission
- [ ] Use storageKey: 'policy_form'

#### Document Upload
- [ ] Add DocumentUpload for policy documents
- [ ] Set maxFiles: 5
- [ ] Set maxFileSize: 10
- [ ] Accept: PDF, JPG, PNG

#### Search & Filter
- [ ] Implement SearchFilter component
- [ ] Add filters: Type, Status, Date Range, Premium Range
- [ ] Handle search term changes
- [ ] Handle filter changes
- [ ] Implement clear filters

#### Toast Notifications
- [ ] Success: "Policy created successfully"
- [ ] Success: "Policy updated successfully"
- [ ] Success: "Policy deleted successfully"
- [ ] Error: "Failed to create policy"
- [ ] Error: "Failed to update policy"
- [ ] Error: "Failed to delete policy"
- [ ] Warning: "Please check all fields"

#### Testing
- [ ] Create new policy
- [ ] Update existing policy
- [ ] Delete policy
- [ ] Search policies
- [ ] Filter by type
- [ ] Filter by status
- [ ] Upload policy documents
- [ ] Form persists on refresh
- [ ] Mobile responsive

---

### app/dashboard/page.tsx

#### Error Handling
- [ ] Add error boundaries
- [ ] Display user-friendly error messages
- [ ] Provide retry functionality
- [ ] Log errors for debugging

#### Loading States
- [ ] Show skeletons while loading
- [ ] Smooth transition to content
- [ ] Handle partial loading (some sections loaded, others loading)

#### Toast Notifications
- [ ] Error: "Failed to load dashboard data"
- [ ] Error: "Failed to load news"
- [ ] Error: "Failed to load stock data"
- [ ] Info: "Dashboard updated"

#### Testing
- [ ] Dashboard loads without errors
- [ ] All sections load correctly
- [ ] Error handling works
- [ ] Loading states display
- [ ] Mobile responsive

---

## Common Issues & Solutions

### Issue: Form not persisting to localStorage
**Solution:**
- Check `storageKey` is provided to `useFormState`
- Verify `isDirty` is true
- Check browser localStorage is enabled
- Check for errors in console

### Issue: Validation not working
**Solution:**
- Verify validation function is imported correctly
- Check `onValidate` is passed to `useFormState`
- Verify form data structure matches validation function
- Check error messages in console

### Issue: API calls not working
**Solution:**
- Check API endpoint URL is correct
- Verify MongoDB connection in lib/db.ts
- Check API response format
- Check for CORS errors in console
- Verify authentication if required

### Issue: Toast notifications not showing
**Solution:**
- Verify `ToastProvider` is in layout.tsx
- Check `toast` is imported from '@/lib/toast'
- Verify toast is called after action
- Check z-index in CSS

### Issue: Document upload not working
**Solution:**
- Check file type is in `acceptedTypes`
- Check file size is under `maxFileSize`
- Check `onDocumentsChange` is called
- Verify documents state is updated

### Issue: Search/Filter not working
**Solution:**
- Check filter options are defined correctly
- Verify `onSearchChange` and filter `onChange` are called
- Check API query parameters are correct
- Verify filter values are passed to API

---

## Performance Optimization Checklist

- [ ] Implement pagination for large datasets
- [ ] Debounce search input
- [ ] Lazy load large components
- [ ] Cache API responses
- [ ] Optimize images
- [ ] Minimize re-renders
- [ ] Use React.memo for expensive components
- [ ] Implement virtual scrolling for long lists

---

## Accessibility Checklist

- [ ] All form inputs have labels
- [ ] All buttons have aria-labels
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Error messages are clear
- [ ] Loading states are announced
- [ ] Focus indicators are visible

---

## Mobile Responsiveness Checklist

- [ ] Forms stack on mobile
- [ ] Tables scroll horizontally
- [ ] Buttons are touch-friendly (min 44x44px)
- [ ] Text is readable on mobile
- [ ] Images scale properly
- [ ] Modals are full-screen on mobile
- [ ] Navigation is accessible on mobile
- [ ] Test on multiple screen sizes

---

## Security Checklist

- [ ] Input validation on all forms
- [ ] XSS prevention (React built-in)
- [ ] CSRF protection (if needed)
- [ ] Sensitive data encrypted in localStorage
- [ ] Error messages don't expose sensitive info
- [ ] API endpoints are protected
- [ ] Rate limiting implemented
- [ ] Audit logging enabled

---

## Testing Checklist

### Unit Tests
- [ ] Validation functions
- [ ] Storage utilities
- [ ] Toast notifications
- [ ] Form state hook
- [ ] API hook

### Integration Tests
- [ ] Form submission with validation
- [ ] API calls with error handling
- [ ] LocalStorage persistence
- [ ] Document upload
- [ ] Search and filtering

### E2E Tests
- [ ] Complete customer creation flow
- [ ] Complete claim filing flow
- [ ] Complete policy creation flow
- [ ] Mobile responsiveness
- [ ] Error scenarios

### Manual Tests
- [ ] Form validation works
- [ ] MongoDB CRUD operations work
- [ ] LocalStorage persistence works
- [ ] Toast notifications display
- [ ] Document upload works
- [ ] Search and filtering work
- [ ] Loading states display
- [ ] Error handling works
- [ ] Mobile responsive design works
- [ ] Keyboard navigation works

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Documentation complete

### Deployment
- [ ] Build successful
- [ ] Environment variables set
- [ ] MongoDB connection verified
- [ ] API endpoints tested
- [ ] Monitoring enabled

### Post-Deployment
- [ ] Monitor error logs
- [ ] Monitor performance
- [ ] User feedback collection
- [ ] Bug fixes as needed

---

## Sign-Off

- [ ] All items completed
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Ready for deployment

**Completed By:** _______________  
**Date:** _______________  
**Reviewed By:** _______________  
**Date:** _______________

---

**For detailed information, see:**
- QUICK_START_GUIDE.md
- IMPROVEMENTS_SUMMARY.md
- IMPLEMENTATION_STATUS.md
