import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import WebhookForm from '../WebhookForm';

const props = {
  handleSubmit: jest.fn(),
  onCancel: jest.fn(),
  onSuccess: jest.fn(),
  templates: [
    { id: 204, name: 'default template' },
    { id: 205, name: 'default template clone' },
  ],
  availableEvents: ['host_created'],
  isEventsLoading: false,
  isTemplatesLoading: false,
};

const fixtures = {
  'should render for new page': {
    ...props,
    initialValues: {
      http_method: 'POST',
      enabled: true,
      verify_ssl: true,
      http_content_type: 'application/json',
      event: 'host_created.event.foreman',
    },
  },
  'should render for edit page': {
    ...props,
    initialValues: {
      id: 54,
      http_method: 'PUT',
      enabled: true,
      verify_ssl: true,
      http_content_type: 'application/json',
      event: 'host_created.event.foreman',
      name: 'first webhook',
      target_url: 'https://foreman.example.com',
      user: undefined,
      password: undefined,
      webhook_template_id: 204,
      ssl_ca_certs: undefined,
    },
  },
};

describe('WebhookForm', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(WebhookForm, fixtures));
});
