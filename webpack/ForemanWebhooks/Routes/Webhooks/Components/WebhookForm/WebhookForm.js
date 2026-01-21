import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Form, ActionGroup, Button } from '@patternfly/react-core';
import WebhookFormTabs from './Components/WebhookFormTabs';

import { HTTP_METHODS } from './constants';

const WebhookForm = ({
  onCancel,
  isLoading,
  handleSubmit,
  initialValues,
  templates,
  availableEvents,
  isTemplatesLoading,
  isEventsLoading,
  isPasswordDisabled,
}) => {
  const webhookTemplates = templates.map(t => ({ value: t.id, label: t.name }));

  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (event, tabIndex) => {
    event.preventDefault();
    setActiveTab(tabIndex);
  };

  const [inputValues, setInputValues] = useState(initialValues);

  const requiredFields = [
    'event',
    'name',
    'target_url',
    'webhook_template_id',
    'http_method',
  ];

  const verifyFields = () =>
    !requiredFields.every(field => {
      if (field === 'target_url') return urlValidated() === 'success';
      return (
        inputValues[field] !== undefined &&
        inputValues[field] !== null &&
        String(inputValues[field]).trim() !== ''
      );
    });

  const urlValidated = () => {
    const value = inputValues.target_url;
    if (!value || !value.trim()) return 'error';
    try {
      const u = new URL(value.trim());
      return u.protocol === 'http:' || u.protocol === 'https:'
        ? 'success'
        : 'error';
    } catch {
      return 'error';
    }
  };

  return (
    <Form isHorizontal>
      <WebhookFormTabs
        inputValues={inputValues}
        setInputValues={setInputValues}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        webhookTemplates={webhookTemplates}
        httpMethods={HTTP_METHODS}
        availableEvents={availableEvents}
        isEventsLoading={isEventsLoading}
        isTemplatesLoading={isTemplatesLoading}
        isPasswordDisabled={isPasswordDisabled}
        urlValidated={urlValidated}
      />
      <ActionGroup>
        <Button
          ouiaId="submit-webhook-form"
          isDisabled={verifyFields() || isLoading}
          variant="primary"
          onClick={() => handleSubmit(inputValues)}
        >
          {__('Submit')}
        </Button>
        <Button ouiaId="cancel-webhook-form" variant="link" onClick={onCancel}>
          {__('Cancel')}
        </Button>
      </ActionGroup>
    </Form>
  );
};

WebhookForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  templates: PropTypes.array.isRequired,
  availableEvents: PropTypes.array.isRequired,
  isEventsLoading: PropTypes.bool.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
  isPasswordDisabled: PropTypes.bool,
};

WebhookForm.defaultProps = {
  isPasswordDisabled: false,
};

export default WebhookForm;
