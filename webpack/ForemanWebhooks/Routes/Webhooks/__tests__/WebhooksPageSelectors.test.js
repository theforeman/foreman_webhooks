import { STATUS } from 'foremanReact/constants';

import {
  selectWebhooks,
  selectPage,
  selectPerPage,
  selectSearch,
  selectSort,
  selectHasData,
  selectHasError,
  selectIsLoading,
  selectSubtotal,
  selectMessage,
  selectCanCreate,
} from '../WebhooksPageSelectors';

import {
  stateFactory,
  webhooks,
} from '../WebhooksIndexPage/__tests__/WebhooksIndexPage.fixtures';

const populatedState = stateFactory({
  results: webhooks,
  sort: { by: 'name', order: 'DESC' },
  page: 1,
  perPage: 1,
  search: 'name ~ foo',
  subtotal: 42,
  canCreate: true,
  message: { type: 'info', text: 'Saved successfully' },
});

const resolvedState = stateFactory(
  { results: webhooks, subtotal: webhooks.length },
  { status: STATUS.RESOLVED }
);

const pendingState = stateFactory({ results: [] }, { status: STATUS.PENDING });

const errorState = {
  API: {
    webhooks: {
      status: STATUS.ERROR,
      response: {
        message: 'Request failed with status code 500',
        response: {
          data: { error: { message: 'Unable to load webhooks' } },
        },
      },
    },
  },
};

describe('WebhooksPage selectors', () => {
  it('returns webhooks from the API response', () => {
    expect(selectWebhooks(populatedState)).toEqual(webhooks);
  });

  it('returns page from the API response', () => {
    expect(selectPage(populatedState)).toBe(1);
  });

  it('returns perPage from the API response', () => {
    expect(selectPerPage(populatedState)).toBe(1);
  });

  it('returns search from the API response', () => {
    expect(selectSearch(populatedState)).toBe('name ~ foo');
  });

  it('returns sort with camelCased column name', () => {
    expect(selectSort(populatedState)).toEqual({ by: 'name', order: 'DESC' });
  });

  it('camelCases snake_case sort column names', () => {
    const state = stateFactory({
      sort: { by: 'target_url', order: 'ASC' },
    });

    expect(selectSort(state)).toEqual({ by: 'targetUrl', order: 'ASC' });
  });

  it('returns hasData as false when the API request is not resolved', () => {
    expect(selectHasData(populatedState)).toBe(false);
  });

  it('returns hasData as true when the API request is resolved with results', () => {
    expect(selectHasData(resolvedState)).toBe(true);
  });

  it('returns hasError as false for a successful API response', () => {
    expect(selectHasError(populatedState)).toBe(false);
  });

  it('returns hasError as true when the API request failed', () => {
    expect(selectHasError(errorState)).toBe(true);
  });

  it('returns isLoading as true when the API status is missing or pending', () => {
    expect(selectIsLoading(populatedState)).toBe(true);
    expect(selectIsLoading(pendingState)).toBe(true);
  });

  it('returns isLoading as false when the API request is resolved', () => {
    expect(selectIsLoading(resolvedState)).toBe(false);
  });

  it('returns subtotal from the API response', () => {
    expect(selectSubtotal(populatedState)).toBe(42);
  });

  it('returns message from the API response when there is no error', () => {
    expect(selectMessage(populatedState)).toEqual({
      type: 'info',
      text: 'Saved successfully',
    });
  });

  it('returns an error message from the API when the request failed', () => {
    expect(selectMessage(errorState)).toEqual({
      type: 'error',
      text: 'Unable to load webhooks',
    });
  });

  it('returns an empty webhook list when the API request failed', () => {
    expect(selectWebhooks(errorState)).toEqual([]);
  });

  it('returns canCreate from the API response', () => {
    expect(selectCanCreate(populatedState)).toBe(true);
  });

  it('returns default pagination values when the API response is empty', () => {
    const emptyState = {
      API: {
        webhooks: {
          status: STATUS.RESOLVED,
          response: {},
        },
      },
    };

    expect(selectPage(emptyState)).toBe(1);
    expect(selectPerPage(emptyState)).toBe(20);
    expect(selectWebhooks(emptyState)).toEqual([]);
    expect(selectSubtotal(emptyState)).toBe(0);
    expect(selectCanCreate(emptyState)).toBe(false);
  });
});
