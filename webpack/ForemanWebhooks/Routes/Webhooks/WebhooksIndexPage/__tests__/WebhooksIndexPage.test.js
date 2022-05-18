import React from 'react';
import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import WebhooksIndexPage from '../WebhooksIndexPage';

const fixtures = {
  'render with minimal props': {
    fetchAndPush: jest.fn(),
    reloadWithSearch: jest.fn(),
    handleCreateSubmit: jest.fn(),
    isLoading: false,
    hasError: false,
    hasData: false,
    itemCount: 0,
    canCreate: true,
    sort: {},
    webhooks: [],
  },
};

describe('WebhooksIndexPage', () => {
  describe('redering', () => {
    const webhooksPage = () => (
      <Provider store={createStore((state = [], action) => state)}>
        <WebhooksIndexPage />
      </Provider>
    );
    testComponentSnapshotsWithFixtures(webhooksPage, fixtures);
  });
});
