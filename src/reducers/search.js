import qs from 'qs';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { apiService } from 'services/apiService';
import { openModal } from './app';

const stringifyQuery = (params) =>
  qs.stringify(params, {
    addQueryPrefix: true,
    filter: (_, value) => value || undefined,
  });

const initialState = {
  isLoading: false,
  loadingFromSearchForm: true,
  cityList: { from_city: null, to_city: null },
  resultsCount: 0,
  resultItems: [],
  lastDirections: [],
  queryParams: {
    from_city_id: '',
    to_city_id: '',
    date_start: '',
    date_end: '',
    offset: 0,
  },
  queryString: '',
};

export const getCitiesAsync = createAsyncThunk(
  'search/fetchCities',
  async ({ searchString, fieldName }, { rejectWithValue }) => {
    try {
      const response = await apiService.routes.citiesList({
        name: searchString,
      });

      const data = await response.json();
      return { fieldName, data };
    } catch (e) {
      return rejectWithValue('Что-то пошло не так :(');
    }
  },
);

export const getDirectionsAsync = createAsyncThunk(
  'search/fetchDirections',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        search: { queryString },
      } = getState();

      const queryParsed = qs.parse(queryString, { ignoreQueryPrefix: true });
      const response = await apiService.routes.routesList(queryParsed);
      const parsed = await response.json();
      if (parsed.error) {
        throw new Error(parsed.error);
      }
      return parsed;
    } catch ({ message }) {
      dispatch(openModal({ type: 'error', message }));
      return rejectWithValue();
    }
  },
);

export const getLastDirectionsAsync = createAsyncThunk(
  'search/fetchLastDirections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.routes.lastList();
      return await response.json();
    } catch (e) {
      return rejectWithValue('Что-то пошло не так :(');
    }
  },
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    changeSearchString: (state, { payload }) => {
      state[payload.fieldName] = payload.searchString;
    },
    clearCitiesList: (state, { payload }) => {
      state.cityList[payload] = null;
    },
    setLoadingFromSearchForm: (state) => {
      state.loadingFromSearchForm = true;
    },
    invertCities: (state) => {
      const { from_city, to_city, from_city_id, to_city_id } =
        state.queryParams;

      state.queryParams = {
        ...state.queryParams,
        from_city: to_city,
        to_city: from_city,
        from_city_id: to_city_id,
        to_city_id: from_city_id,
      };

      const { from_city: fromCityList, to_city: toCityList } = state.cityList;
      state.cityList = { from_city: toCityList, to_city: fromCityList };

      state.queryString = stringifyQuery(state.queryParams);
    },
    updateQueryParams: (
      state,
      { payload: { resetOffset = true, ...params } },
    ) => {
      if (resetOffset) {
        state.queryParams.offset = 0;
      }
      state.queryParams = {
        ...state.queryParams,
        ...params,
      };
      state.queryString = stringifyQuery(state.queryParams);
    },
    updateQueryString: (state, { payload }) => {
      state.queryString = payload;
    },
  },
  extraReducers: {
    [getCitiesAsync.fulfilled]: (state, { payload: { data, fieldName } }) => {
      state.cityList[fieldName] = data;
    },
    [getDirectionsAsync.fulfilled]: (
      state,
      { payload: { total_count, items } },
    ) => {
      state.isLoading = false;
      state.resultsCount = total_count;
      state.resultItems = items;
      state.loadingFromSearchForm = false;
    },
    [getDirectionsAsync.pending]: (state) => {
      state.isLoading = true;
    },
    [getDirectionsAsync.rejected]: (state) => {
      state.isLoading = false;
      state.resultsCount = 0;
      state.resultItems = [];
    },
    [getLastDirectionsAsync.fulfilled]: (state, { payload }) => {
      state.lastDirections = payload;
    },
  },
});

export const {
  changeSearchString,
  clearCitiesList,
  updateQueryString,
  updateQueryParams,
  invertCities,
  setLoadingFromSearchForm,
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
