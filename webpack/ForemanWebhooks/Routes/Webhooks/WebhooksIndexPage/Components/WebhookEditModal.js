import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import ForemanModal from 'foremanReact/components/ForemanModal';
import Loading from 'foremanReact/components/Loading';
import { foremanUrl } from 'foremanReact/common/helpers';
import { submitForm } from 'foremanReact/redux/actions/common/forms';
import { get } from 'foremanReact/redux/API';

import ConnectedWebhookForm from '../../Components/WebhookForm';

import {
  WEBHOOKS_PATH,
  WEBHOOK_API_REQUEST_KEY,
  WEBHOOK_EDIT_MODAL_ID,
  WEBHOOKS_API_PLAIN_PATH,
} from '../../constants';

import {
  selectIsLoading,
  selectWebhookValues,
  selectWebhookTemplateId,
} from './WebhookEditModalSelectors';

import './WebhookModal.scss';

const WebhookEditModal = ({ toEdit, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const id = toEdit;

  const handleSubmit = (values, actions) =>
    dispatch(
      submitForm({
        url: foremanUrl(`/api${WEBHOOKS_PATH}/${id}`),
        values: { ...values, controller: 'webhooks' },
        item: 'Webhook',
        message: __('Webhook was successfully updated.'),
        method: 'put',
        successCallback: onSuccess,
        actions,
      })
    );

  const isLoading = useSelector(selectIsLoading);
  const initialWebhookValues = {
    id: useSelector(selectWebhookValues).id,
    name: useSelector(selectWebhookValues).name,
    target_url: useSelector(selectWebhookValues).targetUrl,
    user: useSelector(selectWebhookValues).user || '',
    password: '',
    http_method: useSelector(selectWebhookValues).httpMethod,
    http_content_type: useSelector(selectWebhookValues).httpContentType || '',
    webhook_template_id: useSelector(selectWebhookTemplateId),
    event: useSelector(selectWebhookValues).event,
    enabled: useSelector(selectWebhookValues).enabled,
    verify_ssl: useSelector(selectWebhookValues).verifySsl,
    ssl_ca_certs: useSelector(selectWebhookValues).sslCaCerts || '',
    http_headers: useSelector(selectWebhookValues).httpHeaders || '',
    proxy_authorization: useSelector(selectWebhookValues).proxyAuthorization,
  };

  useEffect(() => {
    if (id) {
      dispatch(
        get({
          key: WEBHOOK_API_REQUEST_KEY,
          url: foremanUrl(`${WEBHOOKS_API_PLAIN_PATH}/${id}`),
        })
      );
    }
  }, [id, dispatch]);

  return (
    <ForemanModal
      id={WEBHOOK_EDIT_MODAL_ID}
      title={`${__('Edit')} ${initialWebhookValues.name}`}
      backdrop="static"
      className="webhooks-modal"
    >
      <ForemanModal.Header />
      {isLoading ? (
        <Loading />
      ) : (
        <ConnectedWebhookForm
          handleSubmit={handleSubmit}
          initialValues={initialWebhookValues}
          onCancel={onCancel}
        />
      )}
    </ForemanModal>
  );
};

WebhookEditModal.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  toEdit: PropTypes.number,
};

WebhookEditModal.defaultProps = {
  toEdit: 0,
};

export default WebhookEditModal;
