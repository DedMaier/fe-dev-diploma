import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
};

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setPrevStep: (state) => {
      state.step = state.step - 1;
    },
    setNextStep: (state) => {
      state.step = state.step + 1;
    },
    setStep: (state, { payload }) => {
      state.step = payload;
    },
  },
});

export const { setPrevStep, setNextStep, setStep } = stepperSlice.actions;

export const stepperReducer = stepperSlice.reducer;
