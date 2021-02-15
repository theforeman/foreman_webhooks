import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { translate as __ } from 'foremanReact/common/I18n';
import { submitForm } from 'foremanReact/redux/actions/common/forms';
import { foremanUrl } from 'foremanReact/common/helpers';
import ForemanModal from 'foremanReact/components/ForemanModal';

import ConnectedWebhookForm from '../../Components/WebhookForm';

import { WEBHOOK_CREATE_MODAL_ID, WEBHOOKS_PATH } from '../../constants';

import './WebhookModal.scss';

const WebhookCreateModal = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const initialWebhookValues = {
    name: '',
    target_url: '',
    user: '',
    password: '',
    webhook_template_id: undefined,
    event: '',
    http_method: 'POST',
    http_content_type: 'application/json',
    enabled: true,
    verify_ssl: true,
    ssl_ca_certs: '',
    http_headers: '',
    proxy_authorization: false,
  };

  const handleSubmit = (values, actions) =>
    dispatch(
      submitForm({
        url: foremanUrl(`/api${WEBHOOKS_PATH}`),
        values: { ...values, controller: 'webhooks' },
        item: 'Webhook',
        message: __('Webhook was successfully created.'),
        successCallback: onSuccess,
        actions,
      })
    );

  return (
    <ForemanModal
      id={WEBHOOK_CREATE_MODAL_ID}
      title={__('Create Webhook')}
      backdrop="static"
      className="webhooks-modal"
    >
      <ForemanModal.Header />
      <ConnectedWebhookForm
        handleSubmit={handleSubmit}
        initialValues={initialWebhookValues}
        onCancel={onCancel}
      />
    </ForemanModal>
  );
};

WebhookCreateModal.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default WebhookCreateModal;
