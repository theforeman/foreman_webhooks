import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { startCase, camelCase } from 'lodash';

import { foremanUrl } from 'foremanReact/common/helpers';
import { get } from 'foremanReact/redux/API';

import WebhookForm from './WebhookForm';

import {
  selectWebhookTemplates,
  selectWebhookEvents,
  selectTemplatesIsLoading,
  selectEventsIsLoading,
} from './WebhookFormSelectors';

import {
  WEBHOOK_TEMPLATES_API_REQUEST_KEY,
  WEBHOOK_TEMPLATES_API_PATH,
  WEBHOOK_EVENTS_API_REQUEST_KEY,
  WEBHOOKS_API_PLAIN_PATH,
} from '../../constants';

const params = { page: 1, search: 'snippet = false', per_page: 'all' };

const ConnectedWebhookForm = ({ onCancel, handleSubmit, initialValues }) => {
  const dispatch = useDispatch();

  const templates = useSelector(selectWebhookTemplates);
  const availableEvents = useSelector(selectWebhookEvents).map(e => ({
    value: `${e}.event.foreman`,
    label: startCase(camelCase(e)),
  }));
  const isTemplatesLoading = useSelector(selectTemplatesIsLoading);
  const isEventsLoading = useSelector(selectEventsIsLoading);

  useEffect(() => {
    dispatch(
      get({
        key: WEBHOOK_TEMPLATES_API_REQUEST_KEY,
        url: foremanUrl(WEBHOOK_TEMPLATES_API_PATH),
        params,
      })
    );
    dispatch(
      get({
        key: WEBHOOK_EVENTS_API_REQUEST_KEY,
        url: foremanUrl(`${WEBHOOKS_API_PLAIN_PATH}/events`),
      })
    );
  }, [dispatch]);

  return (
    <WebhookForm
      templates={templates}
      availableEvents={availableEvents}
      onCancel={onCancel}
      handleSubmit={handleSubmit}
      initialValues={initialValues}
      isTemplatesLoading={isTemplatesLoading}
      isEventsLoading={isEventsLoading}
    />
  );
};

ConnectedWebhookForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default ConnectedWebhookForm;
