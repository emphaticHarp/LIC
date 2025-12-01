import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  policyType: string;
  sumAssured: number;
  premiumAmount: number;
  premiumFrequency: 'Monthly' | 'Quarterly' | 'Yearly';
  startDate: string;
  maturityDate: string;
  policyTerm: number;
  status: 'Active' | 'Lapsed' | 'Matured' | 'Surrendered';
  nominee: string;
  nomineeRelation: string;
  agentId: string;
  agentName: string;
  branch: string;
  createdAt: string;
  lastPremiumDate?: string;
  nextDueDate?: string;
  documents: Array<{
    name: string;
    type: string;
    uploaded: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
  riders: Array<{
    name: string;
    premium: number;
    status: 'Active' | 'Inactive';
  }>;
}

interface PolicyState {
  policies: Policy[];
  selectedPolicy: Policy | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    type: string;
    agent: string;
    branch: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  analytics: {
    totalPolicies: number;
    activePolicies: number;
    totalSumAssured: number;
    totalPremium: number;
    monthlyCollection: number;
    policiesByType: Record<string, number>;
    policiesByStatus: Record<string, number>;
  };
}

const initialState: PolicyState = {
  policies: [],
  selectedPolicy: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    type: 'all',
    agent: 'all',
    branch: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  analytics: {
    totalPolicies: 0,
    activePolicies: 0,
    totalSumAssured: 0,
    totalPremium: 0,
    monthlyCollection: 0,
    policiesByType: {},
    policiesByStatus: {},
  },
};

// Async thunks
export const fetchPolicies = createAsyncThunk(
  'policies/fetchPolicies',
  async (params: { page?: number; limit?: number; filters?: PolicyState['filters'] }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockPolicies: Policy[] = [
      {
        id: '1',
        policyNumber: 'LIC-123456789',
        customerId: '1',
        customerName: 'Priya Sharma',
        policyType: 'Term Life',
        sumAssured: 5000000,
        premiumAmount: 25000,
        premiumFrequency: 'Yearly',
        startDate: '2023-01-15',
        maturityDate: '2043-01-15',
        policyTerm: 20,
        status: 'Active',
        nominee: 'Rahul Sharma',
        nomineeRelation: 'Husband',
        agentId: '1',
        agentName: 'Rajesh Kumar',
        branch: 'Mumbai Main',
        createdAt: '2023-01-15',
        lastPremiumDate: '2024-01-15',
        nextDueDate: '2025-01-15',
        documents: [
          { name: 'Proposal Form', type: 'Application', uploaded: '2023-01-15', status: 'Verified' },
          { name: 'Medical Report', type: 'Medical', uploaded: '2023-01-20', status: 'Verified' },
        ],
        riders: [
          { name: 'Accidental Death Benefit', premium: 2000, status: 'Active' },
          { name: 'Critical Illness', premium: 3000, status: 'Active' },
        ],
      },
    ];

    return {
      policies: mockPolicies,
      total: mockPolicies.length,
    };
  }
);

export const createPolicy = createAsyncThunk(
  'policies/createPolicy',
  async (policyData: Omit<Policy, 'id' | 'createdAt'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPolicy: Policy = {
      ...policyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    return newPolicy;
  }
);

export const updatePolicy = createAsyncThunk(
  'policies/updatePolicy',
  async ({ id, data }: { id: string; data: Partial<Policy> }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, data };
  }
);

export const renewPolicy = createAsyncThunk(
  'policies/renewPolicy',
  async ({ id, paymentData }: { id: string; paymentData: { amount: number; method: string } }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, paymentData };
  }
);

export const surrenderPolicy = createAsyncThunk(
  'policies/surrenderPolicy',
  async ({ id, reason }: { id: string; reason: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, reason };
  }
);

export const fetchPolicyAnalytics = createAsyncThunk(
  'policies/fetchAnalytics',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalPolicies: 150,
      activePolicies: 120,
      totalSumAssured: 750000000,
      totalPremium: 4500000,
      monthlyCollection: 375000,
      policiesByType: {
        'Term Life': 45,
        'Endowment': 35,
        'Whole Life': 25,
        'ULIP': 20,
        'Health': 25,
      },
      policiesByStatus: {
        'Active': 120,
        'Lapsed': 20,
        'Matured': 8,
        'Surrendered': 2,
      },
    };
  }
);

const policySlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    setSelectedPolicy: (state, action: PayloadAction<Policy | null>) => {
      state.selectedPolicy = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<PolicyState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.policies = action.payload.policies;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch policies';
      })
      // Create Policy
      .addCase(createPolicy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPolicy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.policies.push(action.payload);
      })
      .addCase(createPolicy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create policy';
      })
      // Update Policy
      .addCase(updatePolicy.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.policies.findIndex(policy => policy.id === id);
        if (index !== -1) {
          state.policies[index] = { ...state.policies[index], ...data };
        }
      })
      // Renew Policy
      .addCase(renewPolicy.fulfilled, (state, action) => {
        const { id, paymentData } = action.payload;
        const index = state.policies.findIndex(policy => policy.id === id);
        if (index !== -1) {
          state.policies[index].lastPremiumDate = new Date().toISOString();
          state.policies[index].status = 'Active';
        }
      })
      // Surrender Policy
      .addCase(surrenderPolicy.fulfilled, (state, action) => {
        const { id } = action.payload;
        const index = state.policies.findIndex(policy => policy.id === id);
        if (index !== -1) {
          state.policies[index].status = 'Surrendered';
        }
      })
      // Analytics
      .addCase(fetchPolicyAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { setSelectedPolicy, setFilters, clearError } = policySlice.actions;
export default policySlice.reducer;
