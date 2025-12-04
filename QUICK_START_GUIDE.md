# Quick Start Guide - LIC Application Improvements

## 🚀 Quick Reference

### 1. Form Validation
```typescript
import { validateCustomerForm, validateClaimForm, validatePolicyForm } from '@/lib/validation';

const result = validateCustomerForm(formData);
if (!result.isValid) {
  result.errors.forEach(err => {
    console.log(`${err.field}: ${err.message}`);
  });
}
```

### 2. LocalStorage
```typescript
import { storage } from '@/lib/storage';

// Save data
storage.setItem('key', data, { encrypt: true, ttl: 3600000 });

// Get data
const data = storage.getItem('key');

// Remove data
storage.removeItem('key');

// Clear all
storage.clear();
```

### 3. Toast Notifications
```typescript
import { toast } from '@/lib/toast';

toast.success('Success', 'Operation completed');
toast.error('Error', 'Something went wrong');
toast.warning('Warning', 'Please check');
toast.info('Info', 'FYI');
```

### 4. Form State Management
```typescript
import { useFormState } from '@/hooks/useFormState';
import { validateCustomerForm } from '@/lib/validation';

const {
  formData,
  errors,
  handleInputChange,
  validate,
  reset,
} = useFormState({
  initialData: { name: '', email: '' },
  storageKey: 'customer_form',
  onValidate: validateCustomerForm,
});
```

### 5. API Calls
```typescript
import { useApi } from '@/hooks/useApi';

const api = useApi();

// GET
const result = await api.get('/api/customers?page=1');

// POST
const result = await api.post('/api/customers', { name: 'John' });

// PUT
const result = await api.put('/api/customers', { id: '123', name: 'Jane' });

// DELETE
const result = await api.delete('/api/customers?id=123');
```

### 6. Document Upload
```typescript
import { DocumentUpload } from '@/components/features/document-upload';

<DocumentUpload
  documents={documents}
  onDocumentsChange={setDocuments}
  maxFiles={5}
  maxFileSize={10}
  acceptedTypes={['application/pdf', 'image/jpeg']}
/>
```

### 7. Search & Filter
```typescript
import { SearchFilter } from '@/components/features/search-filter';

<SearchFilter
  searchValue={search}
  onSearchChange={setSearch}
  filters={[
    {
      label: 'Status',
      key: 'status',
      value: status,
      onChange: setStatus,
      options: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
      ],
    },
  ]}
  onClearFilters={() => {
    setSearch('');
    setStatus('all');
  }}
/>
```

### 8. Loading Skeletons
```typescript
import { Skeleton, TableSkeleton, FormSkeleton } from '@/components/ui/skeleton';

{isLoading ? <TableSkeleton rows={5} /> : <Table data={data} />}
{isLoading ? <FormSkeleton /> : <Form />}
```

### 9. Form Error Display
```typescript
import { FormError } from '@/components/ui/form-error';

<FormError message={errors.email} />
```

## 📋 Common Patterns

### Complete Form Implementation
```typescript
'use client';

import { useState } from 'react';
import { useFormState } from '@/hooks/useFormState';
import { useApi } from '@/hooks/useApi';
import { validateCustomerForm } from '@/lib/validation';
import { toast } from '@/lib/toast';
import { FormError } from '@/components/ui/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CustomerForm() {
  const api = useApi();
  const {
    formData,
    errors,
    handleInputChange,
    validate,
    reset,
  } = useFormState({
    initialData: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
    },
    storageKey: 'customer_form',
    onValidate: validateCustomerForm,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Validation failed', 'Please check all fields');
      return;
    }

    const result = await api.post('/api/customers', formData, {
      successMessage: 'Customer created successfully',
      errorMessage: 'Failed to create customer',
    });

    if (result?.success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Full Name</label>
        <Input
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
        />
        <FormError message={errors.fullName} />
      </div>

      <div>
        <label>Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <FormError message={errors.email} />
      </div>

      <Button type="submit" disabled={api.isLoading}>
        {api.isLoading ? 'Creating...' : 'Create Customer'}
      </Button>
    </form>
  );
}
```

### Complete List Implementation
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { SearchFilter } from '@/components/features/search-filter';
import { TableSkeleton } from '@/components/ui/skeleton';

export function CustomersList() {
  const api = useApi({ showToast: false });
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status: status === 'all' ? '' : status,
      });

      const result = await api.get(`/api/customers?${params}`);
      if (result?.data) {
        setCustomers(result.data);
      }
    };

    fetchCustomers();
  }, [search, status, page]);

  return (
    <div className="space-y-4">
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            label: 'Status',
            key: 'status',
            value: status,
            onChange: setStatus,
            options: [
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
        ]}
        onClearFilters={() => {
          setSearch('');
          setStatus('all');
          setPage(1);
        }}
      />

      {api.isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-2">
          {customers.map(customer => (
            <div key={customer._id} className="p-4 border rounded">
              {customer.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🔧 API Response Format

All API endpoints return:
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## 📱 Mobile Responsive

All components are mobile-responsive by default:
- SearchFilter uses responsive grid
- DocumentUpload is touch-friendly
- Forms stack on mobile
- Tables scroll horizontally on mobile

## ⚡ Performance Tips

1. **Use pagination** - Always paginate large datasets
2. **Debounce search** - Debounce search input to reduce API calls
3. **Lazy load** - Use React.lazy() for large components
4. **Cache data** - Cache API responses when appropriate
5. **Optimize images** - Use Next.js Image component

## 🐛 Debugging

### Check localStorage
```typescript
import { storage } from '@/lib/storage';
console.log(storage.getAll());
```

### Check validation
```typescript
import { validateCustomerForm } from '@/lib/validation';
const result = validateCustomerForm(formData);
console.log(result.errors);
```

### Check API calls
```typescript
// Enable in browser DevTools Network tab
// All API calls will show request/response
```

## 📚 File Structure

```
lib/
  ├── db.ts              # MongoDB connection
  ├── validation.ts      # Form validation
  ├── storage.ts         # LocalStorage utilities
  ├── toast.ts           # Toast notifications
  └── audit.ts           # Audit logging

hooks/
  ├── useFormState.ts    # Form state management
  └── useApi.ts          # API call management

components/
  ├── ui/
  │   ├── form-error.tsx
  │   └── skeleton.tsx
  ├── providers/
  │   └── ToastProvider.tsx
  └── features/
      ├── document-upload.tsx
      └── search-filter.tsx

models/
  ├── Customer.ts
  ├── Policy.ts
  └── Claim.ts

app/api/
  ├── customers/route.ts
  ├── policies/route.ts
  └── claims/route.ts
```

## 🎯 Next Steps

1. Update `app/customers/page.tsx` with all improvements
2. Update `app/claims/page.tsx` with all improvements
3. Update `app/policies/page.tsx` with all improvements
4. Test all CRUD operations
5. Test on mobile devices
6. Deploy and monitor

---

**For detailed documentation, see IMPROVEMENTS_SUMMARY.md**
