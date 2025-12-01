import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  aadhaar: string;
  pan: string;
  occupation: string;
  annualIncome: string;
  maritalStatus: string;
  policyIds: string[];
  status: 'Active' | 'Lapsed' | 'Pending';
  agentId: string;
  createdAt: string;
  avatar?: string;
  familyMembers: Array<{
    name: string;
    relation: string;
    age: number;
    phone?: string;
  }>;
  documents: Array<{
    name: string;
    type: string;
    uploaded: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    agent: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    agent: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: { page?: number; limit?: number; search?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43210',
        address: '123, MG Road, Bangalore',
        dateOfBirth: '1990-03-15',
        aadhaar: '2345-6789-0123',
        pan: 'ABCPN1234E',
        occupation: 'Software Engineer',
        annualIncome: '1500000',
        maritalStatus: 'Married',
        policyIds: ['POL-001', 'POL-002'],
        status: 'Active',
        agentId: '1',
        createdAt: '2023-01-15',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        familyMembers: [
          { name: 'Rahul Sharma', relation: 'Husband', age: 35 },
          { name: 'Anaya Sharma', relation: 'Daughter', age: 8 },
        ],
        documents: [
          { name: 'Aadhaar Card', type: 'ID Proof', uploaded: '2023-01-15', status: 'Verified' },
          { name: 'PAN Card', type: 'ID Proof', uploaded: '2023-01-15', status: 'Verified' },
        ],
      },
    ];

    return {
      customers: mockCustomers,
      total: mockCustomers.length,
    };
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    return newCustomer;
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, data }: { id: string; data: Partial<Customer> }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, data };
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return id;
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CustomerState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.customers;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create customer';
      })
      // Update Customer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.customers.findIndex(customer => customer.id === id);
        if (index !== -1) {
          state.customers[index] = { ...state.customers[index], ...data };
        }
      })
      // Delete Customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
      });
  },
});

export const { setSelectedCustomer, setFilters, clearError } = customerSlice.actions;
export default customerSlice.reducer;
