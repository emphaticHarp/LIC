import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';

interface Payment {
  id: string;
  policyId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Online' | 'Cash' | 'Cheque' | 'DD' | 'UPI';
  transactionId: string;
  status: 'Success' | 'Pending' | 'Failed';
  receiptGenerated: boolean;
}

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  isLoading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state: Draft<PaymentState>) => {
      state.error = null;
    },
  },
});

export default paymentSlice.reducer;
