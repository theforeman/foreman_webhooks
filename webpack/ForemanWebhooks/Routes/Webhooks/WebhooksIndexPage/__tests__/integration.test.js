import React from 'react';
import { IntegrationTestHelper } from '@theforeman/test';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import ConnectedWebhooksIndexPage from '../index';

import * as selectors from '../../WebhooksPageSelectors';
import * as editSelectors from '../Components/WebhookEditModalSelectors';
import { spySelector, spyEditSelector } from './WebhooksIndexPage.fixtures';

spySelector(selectors);
spyEditSelector(editSelectors);

describe('WebhooksIndexPage - Integration Test', () => {
  it('should flow', () => {
    const history = createMemoryHistory();
    history.push({ pathname: '/webhooks', search: '' });

    const integrationTestHelper = new IntegrationTestHelper();

    const component = integrationTestHelper.mount(
      <Router history={history}>
        <ConnectedWebhooksIndexPage history={history} />
      </Router>
    );

    expect(component.exists('WebhooksTable')).toEqual(true);
    expect(component.exists('WebhookCreateModal')).toEqual(true);
  });
});
