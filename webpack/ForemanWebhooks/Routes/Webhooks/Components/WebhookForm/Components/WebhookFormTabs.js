import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import { translate as __ } from 'foremanReact/common/I18n';

import ForemanFormikField from './ForemanFormikField';

import './WebhookFormTabs.css';

const WebhookFormTabs = ({
  formProps,
  disabled,
  activeTab,
  handleTabClick,
  webhookTemplates,
  httpMethods,
  availableEvents,
  isTemplatesLoading,
  isEventsLoading,
}) => (
  <Tabs activeKey={activeTab} onSelect={handleTabClick} isFilled>
    <Tab
      className="webhook-form-tab"
      eventKey={0}
      title={<TabTitleText>{__('General')}</TabTitleText>}
    >
      <div className="webhook-form-tab-content">
        <ForemanFormikField
          name="event"
          type="select"
          label={__('Subscribe to')}
          required
          allowClear={false}
          options={availableEvents}
          isLoading={isEventsLoading}
        />
        <ForemanFormikField
          name="name"
          type="text"
          required
          label={__('Name')}
        />
        <ForemanFormikField
          name="target_url"
          type="text"
          required
          label={__('Target URL')}
          labelHelp={__('Target URL that should be called by Foreman')}
        />
        <ForemanFormikField
          name="webhook_template_id"
          type="select"
          label={__('Template')}
          required
          allowClear={false}
          options={webhookTemplates}
          isLoading={isTemplatesLoading}
        />
        <ForemanFormikField
          name="http_method"
          type="select"
          label={__('HTTP Method')}
          required
          allowClear={false}
          options={httpMethods}
        />
        <ForemanFormikField
          name="enabled"
          type="checkbox"
          label={__('Enabled')}
          labelHelp={__('If unchecked, the webhook will be inactive')}
        />
      </div>
    </Tab>
    <Tab
      className="webhook-form-tab"
      eventKey={1}
      title={<TabTitleText>{__('Credentials')}</TabTitleText>}
    >
      <div className="webhook-form-tab-content">
        <ForemanFormikField
          name="user"
          type="text"
          label={__('User')}
          labelHelp={__('Authentication credentials')}
        />
        <ForemanFormikField
          name="password"
          type="password"
          label={__('Password')}
          labelHelp={__('Authentication credentials')}
        />
        <ForemanFormikField
          name="verify_ssl"
          type="checkbox"
          label={__('Verify SSL')}
          labelHelp={__(
            "Uncheck this option to disable validation of the receiver's SSL certificate"
          )}
        />
        <ForemanFormikField
          name="proxy_authorization"
          type="checkbox"
          label={__('Proxy Authorization')}
          labelHelp={__(
            'Authorize with Foreman client certificate and validate smart-proxy CA from Settings'
          )}
        />
        <ForemanFormikField
          name="ssl_ca_certs"
          type="textarea"
          label={__('X509 Certification Authorities')}
          placeholder={__(
            "Optional CAs in PEM format concatenated to verify the receiver's SSL certificate"
          )}
          inputSizeClass="col-md-8"
          rows={8}
        />
      </div>
    </Tab>
    <Tab
      className="webhook-form-tab"
      eventKey={2}
      title={<TabTitleText>{__('Additional')}</TabTitleText>}
    >
      <div className="webhook-form-tab-content">
        <ForemanFormikField
          name="http_content_type"
          type="text"
          label={__('HTTP Content Type')}
        />
        <ForemanFormikField
          name="http_headers"
          type="textarea"
          label={__('Optional HTTP headers as JSON (ERB allowed)')}
          placeholder='{\n"X-Shellhook-Arg-1": "value"\n}'
          inputSizeClass="col-md-8"
          rows={8}
        />
      </div>
    </Tab>
  </Tabs>
);

WebhookFormTabs.propTypes = {
  formProps: PropTypes.object,
  disabled: PropTypes.bool,
  activeTab: PropTypes.number.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  webhookTemplates: PropTypes.array.isRequired,
  httpMethods: PropTypes.array.isRequired,
  availableEvents: PropTypes.array.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
  isEventsLoading: PropTypes.bool.isRequired,
};

WebhookFormTabs.defaultProps = {
  disabled: false,
  formProps: {},
};

export default WebhookFormTabs;
