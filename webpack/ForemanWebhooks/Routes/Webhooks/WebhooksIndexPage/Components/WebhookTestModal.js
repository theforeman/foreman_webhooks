import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import ForemanModal from 'foremanReact/components/ForemanModal';
import ForemanForm from 'foremanReact/components/common/forms/ForemanForm';
import { foremanUrl } from 'foremanReact/common/helpers';
import { submitForm } from 'foremanReact/redux/actions/common/forms';
import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import ForemanFormikField from '../../../Webhooks/Components/WebhookForm/Components/ForemanFormikField';

import {
  WEBHOOK_TEST_MODAL_ID,
  WEBHOOKS_API_PLAIN_PATH,
} from '../../constants';

import './WebhookModal.scss';

const WebhookTestModal = ({ toTest }) => {
  const dispatch = useDispatch();

  const { id, name } = toTest;
  const { setModalClosed: setTestModalClosed } = useForemanModal({
    id: WEBHOOK_TEST_MODAL_ID,
  });
  const initialTestValues = {
    payload: '',
  };
  const errorToast = error =>
    sprintf(
      __('Webhook test failed: %s'),
      error?.response?.data?.error?.message
    );

  const handleSubmit = (values, actions) => {
    dispatch(
      submitForm({
        url: foremanUrl(`${WEBHOOKS_API_PLAIN_PATH}/${id}/test`),
        values: { ...values, controller: 'webhooks' },
        item: 'WebhookTest',
        message: sprintf(__('Webhook %s test was successful'), name),
        method: 'post',
        successCallback: () => actions.setSubmitting(false),
        actions,
        errorToast,
        handleError: () => actions.setSubmitting(false),
      })
    );
  };

  return (
    <ForemanModal
      id={WEBHOOK_TEST_MODAL_ID}
      title={`${__('Test')} ${name}`}
      backdrop="static"
      enforceFocus
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
      <ForemanForm
        onSubmit={handleSubmit}
        initialValues={initialTestValues}
        onCancel={setTestModalClosed}
      >
        <ForemanFormikField
          name="payload"
          type="textarea"
          label={__('Payload')}
          labelHelp={__('Will be sent as is')}
          placeholder="{&#13;&#10;id: 1,&#13;&#10;name: test&#13;&#10;}"
          inputSizeClass="col-md-8"
          rows={8}
        />
      </ForemanForm>
    </ForemanModal>
  );
};

WebhookTestModal.propTypes = {
  toTest: PropTypes.object,
};

WebhookTestModal.defaultProps = {
  toTest: {},
};

export default WebhookTestModal;
