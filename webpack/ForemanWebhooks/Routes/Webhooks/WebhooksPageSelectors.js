import { camelCase, isEmpty } from 'lodash';
import Immutable from 'seamless-immutable';
import { STATUS } from 'foremanReact/constants';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import {
  selectAPIErrorMessage,
  selectAPIStatus,
  selectAPIResponse,
} from 'foremanReact/redux/API/APISelectors';

import { WEBHOOKS_API_REQUEST_KEY } from './constants';

export const emptyResponse = {
  results: [],
  page: 0,
  perPage: 0,
  search: '',
  sort: {},
  canCreate: false,
  subtotal: 0,
  message: {},
};

const selectWebhooksPageResponse = state => {
  const response = deepPropsToCamelCase(
    selectAPIResponse(state, WEBHOOKS_API_REQUEST_KEY)
  );
  if (isEmpty(response)) {
    return Immutable(emptyResponse);
  }
  return response;
};

export const selectIsLoading = state => {
  const status = selectWebhooksPageStatus(state);
  return !status || status === STATUS.PENDING;
};

const selectWebhooksPageStatus = state =>
  selectAPIStatus(state, WEBHOOKS_API_REQUEST_KEY);

export const selectHasError = state =>
  selectWebhooksPageStatus(state) === STATUS.ERROR;

export const selectWebhooks = state => {
  if (selectHasError(state)) {
    return [];
  }
  return selectWebhooksPageResponse(state).results;
};

export const selectHasData = state => {
  const status = selectWebhooksPageStatus(state);
  const results = selectWebhooks(state);

  return status === STATUS.RESOLVED && results && results.length > 0;
};

export const selectPage = state => selectWebhooksPageResponse(state).page || 1;
export const selectPerPage = state =>
  selectWebhooksPageResponse(state).perPage || 20;
export const selectSearch = state => selectWebhooksPageResponse(state).search;

export const selectSort = state => {
  const sort = selectWebhooksPageResponse(state).sort || Immutable({});
  if (sort.by && sort.order) {
    return { ...sort, by: camelCase(sort.by) };
  }
  return sort;
};

export const selectCanCreate = state =>
  selectWebhooksPageResponse(state).canCreate || false;
export const selectSubtotal = state =>
  selectWebhooksPageResponse(state).subtotal || 0;
export const selectMessage = state => {
  if (selectHasError(state)) {
    const message = {
      type: 'error',
      text: selectAPIErrorMessage(state, WEBHOOKS_API_REQUEST_KEY),
    };
    return message;
  }
  return selectWebhooksPageResponse(state).message;
};
