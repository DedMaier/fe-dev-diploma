import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from 'services/apiService';

const initialState = {
  modal: { isOpen: false, type: 'info', message: '' },
};

export const subscribeAsync = createAsyncThunk(
  'app/subscribe',
  async (email, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.subscribe.subscribeCreate({ email });
      if (response.status) {
        dispatch(
          openModal({
            message: `Вы успешно подписались на рассылку на данный e-mail: ${email}. Не забывайте проверять «Спам».`,
          }),
        );
      } else {
        throw new Error('Не получилось подписаться :(');
      }
    } catch ({ message }) {
      dispatch(openModal({ type: 'error', message }));
      return rejectWithValue();
    }
  },
);

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      state.modal = { isOpen: true, ...payload };
    },
    hideModal: (state) => {
      state.modal = initialState.modal;
    },
  },
});

export const { openModal, hideModal } = appSlice.actions;

export const appReducer = appSlice.reducer;
