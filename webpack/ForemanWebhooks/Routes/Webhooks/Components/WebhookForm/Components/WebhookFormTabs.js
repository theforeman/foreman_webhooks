import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';

import './WebhookFormTabs.css';
import FieldConstructor from './FieldConstructor';

const WebhookFormTabs = ({
  inputValues,
  setInputValues,
  activeTab,
  handleTabClick,
  webhookTemplates,
  httpMethods,
  availableEvents,
  isTemplatesLoading,
  isEventsLoading,
  isPasswordDisabled,
  urlValidated,
}) => {
  const updateFieldValue = (key, value) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const URL_ERR_STRING = __('Enter valid URL');

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={handleTabClick}
      isFilled
      ouiaId="webhook-form-tabs"
    >
      <Tab
        ouiaId="webhook-form-tab-general"
        className="webhook-form-tab"
        eventKey={0}
        title={<TabTitleText>{__('General')}</TabTitleText>}
      >
        <div className="webhook-form-tab-content">
          <FieldConstructor
            name="event"
            value={inputValues.event}
            setValue={updateFieldValue}
            type="select"
            label={__('Subscribe to')}
            required
            allowClear={false}
            options={availableEvents}
            isLoading={isEventsLoading}
            placeholder={__('Start typing to search...')}
          />
          <FieldConstructor
            name="name"
            value={inputValues.name}
            setValue={updateFieldValue}
            type="text"
            required
            label={__('Name')}
          />
          <FieldConstructor
            name="target_url"
            value={inputValues.target_url}
            setValue={updateFieldValue}
            validated={urlValidated()}
            errMsg={urlValidated() === 'error' ? URL_ERR_STRING : null}
            type="text"
            required
            label={__('Target URL')}
            labelHelp={
              <div>
                <div>
                  {__(
                    'Target URL that should be called by Foreman (ERB allowed).'
                  )}
                </div>
                <div>
                  {sprintf(
                    __('Example: %s'),
                    'https://host.example.com/inventory/<%= @object.id %>'
                  )}
                </div>
              </div>
            }
          />
          <FieldConstructor
            name="webhook_template_id"
            value={inputValues.webhook_template_id}
            setValue={updateFieldValue}
            type="select"
            label={__('Template')}
            required
            allowClear={false}
            options={webhookTemplates}
            isLoading={isTemplatesLoading}
            placeholder={__('Start typing to search...')}
          />
          <FieldConstructor
            name="http_method"
            value={inputValues.http_method}
            setValue={updateFieldValue}
            type="select"
            label={__('HTTP Method')}
            required
            allowClear={false}
            options={httpMethods}
            placeholder={__('Start typing to search...')}
          />
          <FieldConstructor
            name="enabled"
            value={inputValues.enabled}
            setValue={updateFieldValue}
            type="checkbox"
            label={__('Enabled')}
            labelHelp={__('If unchecked, the webhook will be inactive')}
          />
        </div>
      </Tab>
      <Tab
        ouiaId="webhook-form-tab-creds"
        className="webhook-form-tab"
        eventKey={1}
        title={<TabTitleText>{__('Credentials')}</TabTitleText>}
      >
        <div className="webhook-form-tab-content">
          <FieldConstructor
            name="user"
            value={inputValues.user}
            type="text"
            label={__('User')}
            labelHelp={__('Authentication credentials')}
            setValue={updateFieldValue}
          />
          <FieldConstructor
            name="password"
            type="password"
            value={inputValues.password}
            label={__('Password')}
            labelHelp={__('Authentication credentials')}
            disabled={isPasswordDisabled}
            setValue={updateFieldValue}
          />
          <FieldConstructor
            name="verify_ssl"
            value={inputValues.verify_ssl}
            type="checkbox"
            label={__('Verify SSL')}
            labelHelp={__(
              "Uncheck this option to disable validation of the receiver's SSL certificate"
            )}
            setValue={updateFieldValue}
          />
          <FieldConstructor
            name="proxy_authorization"
            type="checkbox"
            value={inputValues.proxy_authorization}
            label={__('Proxy Authorization')}
            labelHelp={__(
              'Authorize with Foreman client certificate and validate smart-proxy CA from Settings'
            )}
            setValue={updateFieldValue}
          />
          <FieldConstructor
            name="ssl_ca_certs"
            value={inputValues.ssl_ca_certs}
            type="textarea"
            label={__('X509 Certificate Authorities')}
            placeholder={__(
              "Optional CAs in PEM format concatenated to verify the receiver's SSL certificate"
            )}
            inputSizeClass="col-md-8"
            rows={8}
            setValue={updateFieldValue}
          />
        </div>
      </Tab>
      <Tab
        ouiaId="webhook-form-tab-add"
        className="webhook-form-tab"
        eventKey={2}
        title={<TabTitleText>{__('Additional')}</TabTitleText>}
      >
        <div className="webhook-form-tab-content">
          <FieldConstructor
            value={inputValues.http_content_type}
            name="http_content_type"
            type="text"
            label={__('HTTP Content Type')}
            setValue={updateFieldValue}
          />
          <FieldConstructor
            name="http_headers"
            type="textarea"
            value={inputValues.http_headers}
            label={__('HTTP Headers')}
            labelHelp={__('Optional. Must be a JSON object (ERB allowed)')}
            placeholder='{&#13;&#10;"X-Shellhook-Arg-1": "value",&#13;&#10;"X-Shellhook-Arg-2": "<%= @object.id %>"&#13;&#10;}'
            inputSizeClass="col-md-8"
            rows={8}
            setValue={updateFieldValue}
          />
        </div>
      </Tab>
    </Tabs>
  );
};

WebhookFormTabs.propTypes = {
  inputValues: PropTypes.object.isRequired,
  setInputValues: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  webhookTemplates: PropTypes.array.isRequired,
  httpMethods: PropTypes.array.isRequired,
  availableEvents: PropTypes.array.isRequired,
  isTemplatesLoading: PropTypes.bool.isRequired,
  isEventsLoading: PropTypes.bool.isRequired,
  isPasswordDisabled: PropTypes.bool,
  urlValidated: PropTypes.func.isRequired,
};

WebhookFormTabs.defaultProps = {
  isPasswordDisabled: false,
};

export default WebhookFormTabs;
