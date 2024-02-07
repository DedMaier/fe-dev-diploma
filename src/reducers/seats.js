import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { apiService } from 'services/apiService';

const fromDatetime = new Date(2022, 12, 11, 0, 0, 0).getTime();
const toDatetime = new Date(2022, 12, 11, 5, 0, 0).getTime();

const initialState = {

  tripInfo: {
    direction: 'forward',
    from: {
      railway_station_name: 'Курский вокзал',
      city: {
        name: 'Москва',
      },
      datetime: fromDatetime,
    },
    to: {
      railway_station_name: 'Ладожский вокзал',
      city: {
        name: 'Санкт-Петербург',
      },
      datetime: toDatetime,
    },
    train: { name: '116С' },
    price_info: {
      first: {
        top_price: 581,
        bottom_price: 618,
      },
      second: {
        top_price: 581,
        bottom_price: 618,
      },
      third: {
        top_price: 581,
        bottom_price: 618,
      },
      fourth: {
        top_price: 581,
        bottom_price: 618,
      },
    },
    available_seats_info: {
      first: 11,
      second: 22,
      third: 33,
      fourth: 44,
    },
    duration: toDatetime,
  },

  seatsInfo: null,
  selectedRailcarClass: null,
  passengersAmount: {
    adult: { amount: '', selected: 0, limit: 5 },
    child: { amount: '', selected: 0, limit: 0 },
    baby: { amount: '', selected: 0, limit: 0 },
    total: 0,
  },
  selectedAmount: 0,
  selectedSeats: [],
  selectedFeatures: {},
  price: { total: 0, adult: 0, child: 0 },
  additionalPassenger: null,
};

export const getSeatsDetailAsync = createAsyncThunk(
  'search/fetchSeatsDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.routes.seatsDetail(id);
      return await response.json();
    } catch (e) {
      return rejectWithValue('Что-то пошло не так :(');
    }
  },
);

export const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    setTripInfo: (state, { payload: { from, to, ...info } }) => {
      state.tripInfo = { ...info, from, to };
    },
    changeSelectedRailcarType: (state, { payload }) => {
      state.selectedRailcarClass = payload;
    },
    changeRailcarSelection: (state, { payload: { id, railcarClass } }) => {
      const list = current(state.seatsInfo[railcarClass]);

      const railcarIndex = list.findIndex(({ coach: { _id } }) => id === _id);
      const railcar = list[railcarIndex];
      const { isSelected } = railcar.coach;

      state.seatsInfo[railcarClass][railcarIndex].coach.isSelected =
        !isSelected;
    },
    changeFeatureSelection: (
      state,
      { payload: { id, feature, value, price } },
    ) => {
      const railcar = state.selectedFeatures[id];
      if (!railcar) {
        state.selectedFeatures[id] = {};
      }
      state.selectedFeatures[id][feature] = { value, price };
    },
    recalculatePrice: (state) => {
      const ticketsPrice = state.selectedSeats.reduce(
        (acc, { type, price }) => {
          const currPrice = type === 'adult' ? price : price / 2;
          acc[type] += currPrice;
          acc.total += currPrice;
          return acc;
        },
        { adult: 0, child: 0 },
      );

      const selectedFeatures = current(state.selectedFeatures);
      const featuresPrice = Object.values(selectedFeatures).reduce(
        (acc, railcar) => {
          let sum = 0;
          for (const feature in railcar) {
            const { value, price } = railcar[feature];
            sum += value ? price : 0;
          }
          return acc + sum;
        },
        0,
      );

      const { adult, child } = ticketsPrice;
      const total = adult + child + featuresPrice;
      state.price = { adult, child, total, features: featuresPrice };
    },
    changeTicketsAmount: (state, { payload: { type, number } }) => {
      const limit = state.passengersAmount[type].limit;

      switch (type) {
        case 'adult':
          if (number <= limit) {
            state.passengersAmount.adult.amount = number;
            state.passengersAmount.child.limit = number * 2;
            state.passengersAmount.baby.limit = number;
          }
          break;
        default:
          if (number <= limit) {
            state.passengersAmount[type].amount = number;
          }
      }
      for (const type of ['child', 'baby']) {
        const { amount, limit } = state.passengersAmount[type];
        if (amount > limit) {
          state.passengersAmount[type].amount = limit;
        }
      }

      const { adult, child } = current(state.passengersAmount);
      state.selectedAmount = Number(adult.amount) + Number(child.amount);
    },
    changeAdditionalPassenger: (state, { payload }) => {
      state.additionalPassenger = payload;
    },
    changeSeatType: (state, { payload: { index, type } }) => {
      state.selectedSeats[index].type = type;
      const { name } = state.selectedSeats[index];
      const { amount } = current(state.passengersAmount[type]);

      state.passengersAmount[type].amount = +amount + 1;

      const otherType = type === 'adult' ? 'child' : 'adult';

      state.passengersAmount[otherType].amount -= 1;
      if (name) {
        state.passengersAmount[type].selected += 1;
        state.passengersAmount[otherType].selected -= 1;
      }
    },
    addEmptySeat: (state) => {
      state.selectedSeats.push({ type: 'adult', price: 0 });
    },
    changeSeatSelection: (
      state,
      {
        payload: { number, id, railcarClass, value, price, type, name, index },
      },
    ) => {
      const list = current(state.seatsInfo[railcarClass]);

      const railcarIndex = list.findIndex(({ coach: { _id } }) => _id === id);

      if (value) {
        const seat = {
          id,
          number,
          type,
          price,
          name,
          railcarClass,
        };

        if (index) {
          state.selectedSeats[index] = seat;
        } else {
          state.selectedSeats.push(seat);
        }
        state.passengersAmount[type].selected += 1;
      } else {
        const selectedSeatIndex = state.selectedSeats.findIndex(
          ({ id: _id, number: _number }) => id === _id && number === _number,
        );
        const { type } = state.selectedSeats[selectedSeatIndex];
        state.passengersAmount[type].selected -= 1;
        state.selectedSeats.splice(selectedSeatIndex, 1);
      }

      const seatIndex = number - 1;
    
      state.seatsInfo[railcarClass][railcarIndex].seats[seatIndex].isSelected =
        value;
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

export const {
  setTripInfo,
  changeSelectedRailcarType,
  changeRailcarSelection,
  addEmptySeat,
  changeSeatSelection,
  changeTicketsAmount,
  changeFeatureSelection,
  recalculatePrice,
  changeAdditionalPassenger,
  changeSeatType,
} = seatsSlice.actions;

export const seatsReducer = seatsSlice.reducer;
