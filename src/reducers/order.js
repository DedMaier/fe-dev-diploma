import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from 'services/apiService';

const initialState = {
  directionId: null,
  tripInfo: {},
  passengerForms: [],
  userData: {},
  scrollPosition: null,
};

export const getSeatsDetailAsync = createAsyncThunk(
  'order/fetchSeatsDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.routes.seatsDetail(id);
      return await response.json();
    } catch (e) {
      return rejectWithValue('Что-то пошло не так :(');
    }
  },
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (_, { rejectWithValue, getState }) => {
    const {
      order: { userData, passengerForms, directionId },
      seats: { selectedSeats },
    } = getState();
    const { online_payment_type, ...user } = userData;

    let seatIndex = 0;
    const seats = passengerForms.map(
      ({
        ticket_type,
        document_type,
        passport_series,
        passport_number,
        birth_certificate_number,
        limited_mobility,
        ...passenger
      }) => {
        const { id, number } = selectedSeats[seatIndex];
        seatIndex += 1;
        return {
          coach_id: id,
          person_info: {
            isAdult: ticket_type === 'adult',
            document_type,
            document_data:
              document_type === 'passport'
                ? `${passport_series}${passport_number}`
                : birth_certificate_number,
            ...passenger,
          },
          seat_number: number,
          is_child: ticket_type === 'child',
          include_children_seat: false,
        };
      },
    );
    const data = {
      user,
      departure: { route_direction_id: directionId, seats },
    };

    try {
      const response = await apiService.order.orderCreate(data);
      const json = await response.json();
      return json;
    } catch (e) {
      return rejectWithValue('Что-то пошло не так :(');
    }
  },
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setTripInfo: (state, { payload: { from, to, ...info } }) => {
      state.tripInfo = { ...info, from, to };
    },
    setPassengerForms: (state, { payload }) => {
      state.passengerForms = payload;
    },
    setUserData: (state, { payload }) => {
      state.userData = payload;
    },
    setDirectionId: (state, { payload }) => {
      state.directionId = payload;
    },
  },
  extraReducers: {
    [getSeatsDetailAsync.fulfilled]: (state, { payload }) => {
      state.seatsInfo = payload.reduce((acc, { coach, seats }) => {
        const type = coach.class_type;
        let isSelected = false;
        if (!acc[type]) {
          acc[type] = [];
          isSelected = true;
        }
        acc[type].push({ coach: { isSelected, ...coach }, seats });
        return acc;
      }, {});
    },
  },
});

export const { setTripInfo, setPassengerForms, setUserData, setDirectionId } =
  orderSlice.actions;

export const orderReducer = orderSlice.reducer;
