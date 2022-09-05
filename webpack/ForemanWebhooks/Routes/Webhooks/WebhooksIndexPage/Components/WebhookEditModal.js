import React, { useEffect, useState } from 'react';
import { Modal } from 'patternfly-react';
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

  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);
  const id = toEdit;

  const isLoading = useSelector(selectIsLoading);
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

  const handleSubmit = (values, actions) => {
    if (isPasswordDisabled) {
      delete values.password;
    }
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

  const onEditCancel = () => {
    if (isPasswordSet) setIsPasswordDisabled(true);
    onCancel();
  };

  return (
    <ForemanModal
      id={WEBHOOK_EDIT_MODAL_ID}
      backdrop="static"
      className="webhooks-modal"
    >
      <Modal.Header>
        <Modal.Title>
          {`${__('Edit')} ${initialWebhookValues.name}`}
        </Modal.Title>
      </Modal.Header>
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
