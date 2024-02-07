export var ContentType;
(function (ContentType) {
  ContentType['Json'] = 'application/json';
  ContentType['FormData'] = 'multipart/form-data';
  ContentType['UrlEncoded'] = 'application/x-www-form-urlencoded';
})(ContentType || (ContentType = {}));
export class HttpClient {
  baseUrl = 'https://students.netoservices.ru/fe-diplom/';
  securityData = null;
  securityWorker;
  abortControllers = new Map();
  customFetch = (...fetchParams) => fetch(...fetchParams);
  baseApiParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
  constructor(apiConfig = {}) {
    Object.assign(this, apiConfig);
  }
  setSecurityData = (data) => {
    this.securityData = data;
  };
  encodeQueryParam(key, value) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === 'number' ? value : `${value}`,
    )}`;
  }
  addQueryParam(query, key) {
    return this.encodeQueryParam(key, query[key]);
  }
  addArrayQueryParam(query, key) {
    const value = query[key];
    return value.map((v) => this.encodeQueryParam(key, v)).join('&');
  }
  toQueryString(rawQuery) {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }
  addQueryParams(rawQuery) {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }
  contentFormatters = {
    [ContentType.Json]: (input) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input) => this.toQueryString(input),
  };
  mergeRequestParams(params1, params2) {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }
  createAbortSignal = (cancelToken) => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }
    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };
  abortRequest = (cancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);
    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };
  request = async ({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }) => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;
    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...requestParams,
        headers: {
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
          ...(requestParams.headers || {}),
        },
        signal: cancelToken
          ? this.createAbortSignal(cancelToken)
          : requestParams.signal,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response;
      r.data = null;
      r.error = null;
      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });
      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }
      if (!response.ok) throw data;
      return data;
    });
  };
}

export class Api extends HttpClient {
  routes = {
    /**
     * @description  Поиск городов среди возможных направлений (для подсказок в процессе ввода города на главном экране). Выдаёт первые 10 результатов.
     *
     * @tags Города
     * @name CitiesList
     * @request GET:/routes/cities
     */
    citiesList: (query, params = {}) =>
      this.request({
        path: `/routes/cities/`,
        method: 'GET',
        query: query,
        ...params,
      }),
    /**
     * @description Поиск направлений
     *
     * @tags Направления
     * @name RoutesList
     * @request GET:/routes
     */
    routesList: (query, params = {}) =>
      this.request({
        path: `/routes/`,
        method: 'GET',
        query: query,
        ...params,
      }),
    /**
     * @description Возвращает последние 5 направлений
     *
     * @tags Направления
     * @name LastList
     * @request GET:/routes/last
     */
    lastList: (params = {}) =>
      this.request({
        path: `/routes/last/`,
        method: 'GET',
        ...params,
      }),
    /**
     * @description  Информация о посадочных местах определённого направления. Параметры поиска позволят отфильтровать только нужные вагоны в составе
     *
     * @tags Направления
     * @name SeatsDetail
     * @request GET:/routes/{id}/seats
     */
    seatsDetail: (id, query, params = {}) =>
      this.request({
        path: `/routes/${id}/seats/`,
        method: 'GET',
        query: query,
        ...params,
      }),
  };
  order = {
    /**
     * @description Оформление заказа выбранного направления
     *
     * @tags Оформление заказа
     * @name OrderCreate
     * @request POST:/order
     */
    orderCreate: (data, params = {}) =>
      this.request({
        path: `/order/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  subscribe = {
    /**
     * @description Подписка на почтовые уведомления
     *
     * @tags Подписка
     * @name SubscribeCreate
     * @request POST:/subscribe
     */
    subscribeCreate: (query, params = {}) =>
      this.request({
        path: `/subscribe/`,
        method: 'POST',
        query: query,
        ...params,
      }),
  };
}

export const apiService = new Api();
