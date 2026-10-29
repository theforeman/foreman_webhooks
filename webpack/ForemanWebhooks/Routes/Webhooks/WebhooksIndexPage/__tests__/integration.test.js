import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import { API } from 'foremanReact/redux/API';

jest.mock('foremanReact/redux/API/API');

import WebhooksIndexPage from '../WebhooksIndexPage';
import { WEBHOOKS_API_PLAIN_PATH } from '../../constants';

const { renderWithStoreAndI18n } = rtlHelpers;

const webhooksApiResponse = {
  data: {
    results: [
      {
        id: 1,
        name: 'my-webhook',
        target_url: 'https://my-machine.example.com',
        can_edit: true,
        can_delete: true,
        enabled: true,
      },
      {
        id: 2,
        name: 'your-webhook',
        target_url: 'https://your-machine.example.com',
        can_edit: false,
        can_delete: false,
        enabled: false,
      },
    ],
    page: 1,
    per_page: 20,
    subtotal: 2,
    total: 2,
    search: '',
    can_create: true,
  },
};

const webhookTemplatesApiResponse = {
  data: {
    results: [{ id: 1, name: 'Default webhook template' }],
    subtotal: 1,
    page: 1,
    per_page: 20,
  },
};

const webhookEventsApiResponse = {
  data: ['host_created', 'host_updated'],
};

const mockIndexApiGet = () => {
  API.get.mockImplementation(url => {
    const path = typeof url === 'string' ? url : '';

    if (path.includes('/events')) {
      return Promise.resolve(webhookEventsApiResponse);
    }

    if (path.includes('webhook_templates')) {
      return Promise.resolve(webhookTemplatesApiResponse);
    }

    if (path.includes(WEBHOOKS_API_PLAIN_PATH) && !path.includes('/events')) {
      return Promise.resolve(webhooksApiResponse);
    }

    return Promise.resolve({ data: { results: [], total: 0, subtotal: 0 } });
  });
};

const renderPage = () =>
  renderWithStoreAndI18n(
    <MemoryRouter initialEntries={['/webhooks']}>
      <WebhooksIndexPage />
    </MemoryRouter>
  );

describe('WebhooksIndexPage integration', () => {
  beforeEach(() => {
    mockIndexApiGet();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the webhooks table after the index API loads', async () => {
    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Webhooks' })
    ).toBeInTheDocument();
    expect(await screen.findByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Target URL' })
    ).toBeInTheDocument();
    expect(await screen.findByText('my-webhook')).toBeInTheDocument();
    expect(screen.getByText('your-webhook')).toBeInTheDocument();
    expect(API.get).toHaveBeenCalledWith(
      expect.stringContaining(WEBHOOKS_API_PLAIN_PATH),
      expect.anything(),
      expect.anything()
    );
  });

  it('opens the create webhook modal from the toolbar', async () => {
    renderPage();

    await screen.findByText('my-webhook');

    expect(
      screen.queryByRole('dialog', { name: 'Create Webhook' })
    ).not.toBeInTheDocument();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Create new' })
    );

    expect(
      screen.getByRole('dialog', { name: 'Create Webhook' })
    ).toBeInTheDocument();
  });
});
