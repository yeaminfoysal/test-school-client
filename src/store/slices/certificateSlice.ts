import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Certificate } from '../../types';

interface CertificateState {
  certificates: Certificate[];
  currentCertificate: Certificate | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
}

const initialState: CertificateState = {
  certificates: [],
  currentCertificate: null,
  isLoading: false,
  error: null,
  isGenerating: false,
};

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    setCertificates: (state, action: PayloadAction<Certificate[]>) => {
      state.certificates = action.payload;
    },
    setCurrentCertificate: (state, action: PayloadAction<Certificate>) => {
      state.currentCertificate = action.payload;
    },
    addCertificate: (state, action: PayloadAction<Certificate>) => {
      state.certificates.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCertificates,
  setCurrentCertificate,
  addCertificate,
  setLoading,
  setGenerating,
  setError,
  clearError,
} = certificateSlice.actions;

export default certificateSlice.reducer;