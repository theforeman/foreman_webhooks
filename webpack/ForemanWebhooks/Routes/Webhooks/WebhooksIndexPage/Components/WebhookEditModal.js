import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import Loading from 'foremanReact/components/Loading';
import { foremanUrl } from 'foremanReact/common/helpers';
import { get, put } from 'foremanReact/redux/API';
import { Modal, ModalVariant } from '@patternfly/react-core';

import ConnectedWebhookForm from '../../Components/WebhookForm';

import {
  WEBHOOKS_PATH,
  WEBHOOK_API_REQUEST_KEY,
  WEBHOOK_EDIT_MODAL_ID,
  WEBHOOKS_API_PLAIN_PATH,
} from '../../constants';

import {
  selectWebhookValues,
  selectWebhookTemplateId,
} from './WebhookEditModalSelectors';

import './WebhookModal.scss';

const WebhookEditModal = ({ toEdit, onSuccess, modalState }) => {
  const dispatch = useDispatch();

  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const id = toEdit;

  const isPasswordSet = useSelector(selectWebhookValues).passwordSet;
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
    setIsPasswordDisabled(isPasswordSet);
  }, [isPasswordSet]);

  const handleSubmit = values => {
    if (isPasswordDisabled) {
      delete values.password;
    }
    dispatch(
      put({
        url: foremanUrl(`/api${WEBHOOKS_PATH}/${id}`),
        key: WEBHOOK_API_REQUEST_KEY,
        params: { ...values, controller: 'webhooks' },
        successToast: () => __('Webhook was successfully updated.'),
        handleSuccess: onSuccess,
        errorToast: ({ response }) =>
          // eslint-disable-next-line camelcase
          response?.data?.error?.full_messages?.[0] || response,
      })
    );
  };

  useEffect(() => {
    if (initialWebhookValues.id) setIsLoading(false);
  }, [initialWebhookValues.id]);

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      dispatch(
        get({
          key: WEBHOOK_API_REQUEST_KEY,
          url: foremanUrl(`${WEBHOOKS_API_PLAIN_PATH}/${id}`),
        })
      );
    }
  }, [id, dispatch]);

  const onEditCancel = () => {
    if (isPasswordSet) setIsPasswordDisabled(true);
    modalState.closeModal();
  };

  const modalTitle = initialWebhookValues.name ?? '';

  return (
    <Modal
      position="top"
      variant={ModalVariant.medium}
      id={WEBHOOK_EDIT_MODAL_ID}
      ouiaId={WEBHOOK_EDIT_MODAL_ID}
      isOpen={modalState.isOpen}
      onClose={modalState.closeModal}
      title={`${__('Edit')} ${modalTitle}`}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <ConnectedWebhookForm
          handleSubmit={handleSubmit}
          initialValues={initialWebhookValues}
          onCancel={onEditCancel}
          isPasswordDisabled={isPasswordDisabled}
          setIsPasswordDisabled={setIsPasswordDisabled}
        />
      )}
    </Modal>
  );
};

WebhookEditModal.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  toEdit: PropTypes.number,
  modalState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
};

WebhookEditModal.defaultProps = {
  toEdit: 0,
};

export default WebhookEditModal;
