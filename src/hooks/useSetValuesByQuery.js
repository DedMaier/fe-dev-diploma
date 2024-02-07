import qs from 'qs';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { updateQueryParams } from 'reducers/search';

const formatParam = (param) => {
  switch (param) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return param;
  }
};

export const useSetValuesByQuery = (values, setValue) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const queryParams = qs.parse(search, { ignoreQueryPrefix: true });

  useEffect(() => {
    dispatch(updateQueryParams(queryParams));
    for (const paramName in queryParams) {
      if (values.hasOwnProperty(paramName)) {
        const value = formatParam(queryParams[paramName]);
        setValue(paramName, value);
      }
    }
  }, []);
};
