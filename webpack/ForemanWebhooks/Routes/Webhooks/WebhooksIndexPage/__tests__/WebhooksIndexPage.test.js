import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import mockForemanTableIndexPage from './mocks/MockForemanTableIndexPage';

import * as selectors from '../../WebhooksPageSelectors';
import WebhooksIndexPage from '../WebhooksIndexPage';
import {
  spySelector,
  webhooks as webhooksFixture,
} from './WebhooksIndexPage.fixtures';

jest.mock('../../Components/WebhookTable/Components/Formatters', () => ({
  nameToEditFormatter: () => () => null,
  enabledCellFormatter: () => () => null,
  actionCellFormatter: () => () => null,
}));

jest.mock('foremanReact/components/PF4/TableIndexPage/TableIndexPage', () => ({
  __esModule: true,
  default: mockForemanTableIndexPage,
}));

jest.mock('../Components/WebhookCreateModal', () => ({
  __esModule: true,
  default: ({ isOpen, onCancel }) =>
    isOpen ? (
      <div data-testid="webhook-create-modal">
        <button type="button" onClick={onCancel}>
          Close create modal
        </button>
      </div>
    ) : null,
}));

jest.mock('../Components/WebhookDeleteModal', () => ({
  __esModule: true,
  default: ({ modalState }) =>
    modalState.isOpen ? (
      <div data-testid="webhook-delete-modal">Delete modal</div>
    ) : null,
}));

jest.mock('../Components/WebhookEditModal', () => ({
  __esModule: true,
  default: ({ modalState }) =>
    modalState.isOpen ? (
      <div data-testid="webhook-edit-modal">Edit modal</div>
    ) : null,
}));

jest.mock('../Components/WebhookTestModal', () => ({
  __esModule: true,
  default: ({ modalState }) =>
    modalState.isOpen ? (
      <div data-testid="webhook-test-modal">Test modal</div>
    ) : null,
}));

const store = createStore((state = {}) => state);

const renderPage = () =>
  render(
    <Provider store={store}>
      <WebhooksIndexPage />
    </Provider>
  );

describe('WebhooksIndexPage', () => {
  beforeAll(() => {
    spySelector(selectors);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    selectors.selectWebhooks.mockImplementation(() => []);
  });

  it('renders the webhooks header', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'Webhooks' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('webhooks-table-index')).toBeInTheDocument();
  });

  it('renders webhook rows from the store', () => {
    selectors.selectWebhooks.mockImplementation(() => webhooksFixture);

    renderPage();

    expect(screen.getByText('my-webhook')).toBeInTheDocument();
    expect(screen.getByText('your-webhook')).toBeInTheDocument();
  });

  it('opens the create modal when Create new is clicked', () => {
    renderPage();

    expect(
      screen.queryByTestId('webhook-create-modal')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create new' }));

    expect(screen.getByTestId('webhook-create-modal')).toBeInTheDocument();
  });

  it('closes the create modal when cancel is triggered', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Create new' }));
    expect(screen.getByTestId('webhook-create-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close create modal' }));

    expect(
      screen.queryByTestId('webhook-create-modal')
    ).not.toBeInTheDocument();
  });
});
