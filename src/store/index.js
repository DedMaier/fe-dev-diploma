import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from 'reducers/app';
import { searchReducer } from 'reducers/search';
import { stepperReducer } from 'reducers/stepper';
import { seatsReducer } from 'reducers/seats';
import { orderReducer } from 'reducers/order';

export const store = configureStore({
  reducer: {
    app: appReducer,
    search: searchReducer,
    stepper: stepperReducer,
    seats: seatsReducer,
    order: orderReducer,
  },
});
