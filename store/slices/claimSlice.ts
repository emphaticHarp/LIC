import { createSlice, createAsyncThunk, PayloadAction, AnyAction, Draft } from '@reduxjs/toolkit';

interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  customerId: string;
  customerName: string;
  policyType: string;
  claimType: 'Death' | 'Maturity' | 'Surrender' | 'Critical Illness' | 'Accident' | 'Hospitalization';
  amount: number;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid' | 'Closed';
  submittedDate: string;
  updatedDate: string;
  assignedTo: string;
  documents: Array<{
    name: string;
    type: string;
    uploaded: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
  notes: Array<{
    id: string;
    content: string;
    addedBy: string;
    addedDate: string;
  }>;
  assessment: {
    verifiedAmount?: number;
    approvedAmount?: number;
    rejectionReason?: string;
    assessmentDate?: string;
    assessor?: string;
  };
}

interface ClaimState {
  claims: Claim[];
  selectedClaim: Claim | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    type: string;
    dateRange: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  analytics: {
    totalClaims: number;
    pendingClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    totalAmount: number;
    paidAmount: number;
    claimsByType: Record<string, number>;
    claimsByStatus: Record<string, number>;
  };
}

const initialState: ClaimState = {
  claims: [],
  selectedClaim: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    type: 'all',
    dateRange: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  analytics: {
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalAmount: 0,
    paidAmount: 0,
    claimsByType: {},
    claimsByStatus: {},
  },
};

export const fetchClaims = createAsyncThunk(
  'claims/fetchClaims',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockClaims: Claim[] = [
      {
        id: '1',
        claimNumber: 'CLM-2024-001',
        policyId: 'POL-001',
        customerId: '1',
        customerName: 'Priya Sharma',
        policyType: 'Term Life',
        claimType: 'Death',
        amount: 5000000,
        status: 'Under Review',
        submittedDate: '2024-11-15',
        updatedDate: '2024-11-20',
        assignedTo: 'Agent-001',
        documents: [
          { name: 'Death Certificate', type: 'Legal', uploaded: '2024-11-15', status: 'Verified' },
          { name: 'Claim Form', type: 'Application', uploaded: '2024-11-15', status: 'Verified' },
        ],
        notes: [
          { id: '1', content: 'Documents verified, processing claim', addedBy: 'Agent-001', addedDate: '2024-11-20' },
        ],
        assessment: {
          verifiedAmount: 5000000,
          approvedAmount: 5000000,
          assessmentDate: '2024-11-25',
          assessor: 'Claims Officer-001',
        },
      },
    ];

    return {
      claims: mockClaims,
      total: mockClaims.length,
    };
  }
);

const claimSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setSelectedClaim: (state: Draft<ClaimState>, action: PayloadAction<Claim | null>) => {
      state.selectedClaim = action.payload;
    },
    setFilters: (state: Draft<ClaimState>, action: PayloadAction<Partial<ClaimState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state: Draft<ClaimState>) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchClaims.pending, (state: Draft<ClaimState>) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state: Draft<ClaimState>, action: AnyAction) => {
        state.isLoading = false;
        state.claims = action.payload.claims;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchClaims.rejected, (state: Draft<ClaimState>, action: AnyAction) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch claims';
      });
  },
});

export const { setSelectedClaim, setFilters, clearError } = claimSlice.actions;
export default claimSlice.reducer;
