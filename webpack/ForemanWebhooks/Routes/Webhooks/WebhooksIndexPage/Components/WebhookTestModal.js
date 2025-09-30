import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import {
  Form,
  Button,
  ActionGroup,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';

import { APIActions } from 'foremanReact/redux/API';
import {
  WEBHOOK_TEST_MODAL_ID,
  WEBHOOKS_API_PLAIN_PATH,
} from '../../constants';

import './WebhookModal.scss';
import FieldConstructor from '../../Components/WebhookForm/Components/FieldConstructor';

const WebhookTestModal = ({ toTest, modalState }) => {
  const dispatch = useDispatch();

  const { id, name } = toTest;
  const initialTestValues = {
    payload: '',
  };

  const [value, setValue] = useState(initialTestValues);

  const errorToast = error =>
    sprintf(
      __('Webhook test failed: %s'),
      error?.response?.data?.error?.message
    );

  const handleSubmit = values => {
    dispatch(
      APIActions.post({
        key: WEBHOOK_TEST_MODAL_ID,
        url: foremanUrl(`${WEBHOOKS_API_PLAIN_PATH}/${id}/test`),
        params: {
          ...values,
          controller: 'webhooks',
        },
        successToast: () => sprintf(__('Webhook %s test was successful'), name),
        errorToast: error => errorToast(error),
        handleSuccess: () => modalState.closeModal(),
      })
    );
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={modalState.isOpen}
      onClose={modalState.closeModal}
      id={WEBHOOK_TEST_MODAL_ID}
      ouiaId={WEBHOOK_TEST_MODAL_ID}
      title={`${__('Test')} ${name}`}
      className="webhooks-modal"
    >
      {`${sprintf(__('You are about to test %s webhook.'), name)} `}
      {`${__(
        'Please, note that this will not contain actual information or render the attached template.'
      )} `}
      {`${__(
        'In case you are using dynamic URL (ERB template), this will not be rendered correctly due to the absence of a real object.'
      )} `}
      {__('You can specify below a custom payload to test the webhook with.')}
      <br />
      <br />
      <Form>
        <FieldConstructor
          name="payload"
          type="textarea"
          label={__('Payload')}
          labelHelp={__('Will be sent as is')}
          placeholder="{&#13;&#10;id: 1,&#13;&#10;name: test&#13;&#10;}"
          inputSizeClass="col-md-8"
          rows={8}
          value={value.payload}
          setValue={(key, val) => {
            setValue(prev => ({ ...prev, [key]: val }));
          }}
        />
        <ActionGroup>
          <Button
            ouiaId="submit-webhook-form"
            variant="primary"
            onClick={() => handleSubmit(value)}
          >
            {__('Submit')}
          </Button>
          <Button
            ouiaId="cancel-webhook-form"
            variant="link"
            onClick={modalState.closeModal}
          >
            {__('Cancel')}
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};

WebhookTestModal.propTypes = {
  toTest: PropTypes.object,
  modalState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
};

WebhookTestModal.defaultProps = {
  toTest: {},
};

export default WebhookTestModal;
