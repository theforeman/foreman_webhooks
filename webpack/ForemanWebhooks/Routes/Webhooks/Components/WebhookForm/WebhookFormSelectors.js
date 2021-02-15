import { STATUS } from 'foremanReact/constants';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import {
  selectAPIStatus,
  selectAPIResponse,
} from 'foremanReact/redux/API/APISelectors';

import {
  WEBHOOK_TEMPLATES_API_REQUEST_KEY,
  WEBHOOK_EVENTS_API_REQUEST_KEY,
} from '../../constants';

// Webhook templates selectors
const selectWebhookFormTemplatesResponse = state =>
  deepPropsToCamelCase(
    selectAPIResponse(state, WEBHOOK_TEMPLATES_API_REQUEST_KEY)
  );

const selectWebhookFormTemplatesStatus = state =>
  selectAPIStatus(state, WEBHOOK_TEMPLATES_API_REQUEST_KEY);

export const selectTemplatesHasError = state =>
  selectWebhookFormTemplatesStatus(state) === STATUS.ERROR;

export const selectTemplatesIsLoading = state => {
  const status = selectWebhookFormTemplatesStatus(state);
  return !status || status === STATUS.PENDING;
};

export const selectWebhookTemplates = state => {
  if (selectTemplatesHasError(state) || selectTemplatesIsLoading(state))
    return [];

  return selectWebhookFormTemplatesResponse(state).results;
};

// Webhook events selectors
const selectWebhookFormEventsResponse = state =>
  deepPropsToCamelCase(
    selectAPIResponse(state, WEBHOOK_EVENTS_API_REQUEST_KEY)
  );

const selectWebhookFormEventsStatus = state =>
  selectAPIStatus(state, WEBHOOK_EVENTS_API_REQUEST_KEY);

export const selectEventsHasError = state =>
  selectWebhookFormEventsStatus(state) === STATUS.ERROR;

export const selectEventsIsLoading = state => {
  const status = selectWebhookFormEventsStatus(state);
  return !status || status === STATUS.PENDING;
};

export const selectWebhookEvents = state => {
  if (selectEventsHasError(state) || selectEventsIsLoading(state)) return [];

  return selectWebhookFormEventsResponse(state);
};
