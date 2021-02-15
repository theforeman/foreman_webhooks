import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { translate as __ } from 'foremanReact/common/I18n';
import ForemanForm from 'foremanReact/components/common/forms/ForemanForm';

import WebhookFormTabs from './Components/WebhookFormTabs';

import { HTTP_METHODS, WEBHOOK_ITEM } from './constants';

const webhookFormSchema = Yup.object().shape({
  name: Yup.string().required(__('is required')),
  target_url: Yup.string().required(__('is required')),
  http_method: Yup.string().required(__('is required')),
  event: Yup.string().required(__('is required')),
  webhook_template_id: Yup.string().required(__('is required')),
});

const WebhookForm = ({
  onCancel,
  handleSubmit,
  initialValues,
  templates,
  availableEvents,
  isTemplatesLoading,
  isEventsLoading,
}) => {
  const webhookTemplates = templates.map(t => ({ value: t.id, label: t.name }));

  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (event, tabIndex) => {
    event.preventDefault();
    setActiveTab(tabIndex);
  };

  return (
    <ForemanForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={webhookFormSchema}
      onCancel={onCancel}
      enableReinitialize
      item={WEBHOOK_ITEM}
    >
      <WebhookFormTabs
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        webhookTemplates={webhookTemplates}
        httpMethods={HTTP_METHODS}
        availableEvents={availableEvents}
        isEventsLoading={isEventsLoading}
        isTemplatesLoading={isTemplatesLoading}
      />
    </ForemanForm>
  );
};

WebhookForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  templates: PropTypes.array.isRequired,
  availableEvents: PropTypes.array.isRequired,
  isEventsLoading: PropTypes.bool.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
};

export default WebhookForm;
