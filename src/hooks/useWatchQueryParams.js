import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { updateQueryString } from 'reducers/search';

export const useWatchQueryParams = (queryString, callback) => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!queryString) {
      return;
    }
    history.push({
      search: queryString,
    });
    callback();
  }, [queryString]);

  useEffect(() => dispatch(updateQueryString('')), []);
};
