import { STATUS } from 'foremanReact/constants';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';
import {
  selectAPIStatus,
  selectAPIResponse,
} from 'foremanReact/redux/API/APISelectors';

import { WEBHOOK_API_REQUEST_KEY } from '../../constants';

export const selectWebhookValues = state =>
  deepPropsToCamelCase(selectAPIResponse(state, WEBHOOK_API_REQUEST_KEY)) || {};

export const selectWebhookTemplateId = state =>
  selectWebhookValues(state)?.webhookTemplate?.id || 0;

const selectWebhooksEditPageStatus = state =>
  selectAPIStatus(state, WEBHOOK_API_REQUEST_KEY);

export const selectIsLoading = state => {
  const status = selectWebhooksEditPageStatus(state);
  return !status || status === STATUS.PENDING;
};
