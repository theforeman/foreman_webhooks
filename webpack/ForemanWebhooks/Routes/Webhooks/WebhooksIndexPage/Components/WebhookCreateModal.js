import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';

import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { APIActions } from 'foremanReact/redux/API';

import ConnectedWebhookForm from '../../Components/WebhookForm';

import { WEBHOOK_CREATE_MODAL_ID, WEBHOOKS_PATH } from '../../constants';

import './WebhookModal.scss';

const WebhookCreateModal = ({ onSuccess, onCancel, isOpen }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = values => {
    setIsLoading(true);
    dispatch(
      APIActions.post({
        url: foremanUrl(`/api${WEBHOOKS_PATH}`),
        key: WEBHOOK_CREATE_MODAL_ID,
        params: { ...values, controller: 'webhooks' },
        successToast: () => __('Webhook was successfully created.'),
        handleSuccess: () => {
          onSuccess();
          setIsLoading(false);
        },
        handleError: () => setIsLoading(false),
        errorToast: ({ response }) =>
          // eslint-disable-next-line camelcase
          response?.data?.error?.full_messages?.[0] || response,
      })
    );
  };

  return (
    <Modal
      position="top"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onCancel}
      id={WEBHOOK_CREATE_MODAL_ID}
      ouiaId={WEBHOOK_CREATE_MODAL_ID}
      title={__('Create Webhook')}
    >
      <ConnectedWebhookForm
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        initialValues={initialWebhookValues}
        onCancel={onCancel}
      />
    </Modal>
  );
};

WebhookCreateModal.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default WebhookCreateModal;
