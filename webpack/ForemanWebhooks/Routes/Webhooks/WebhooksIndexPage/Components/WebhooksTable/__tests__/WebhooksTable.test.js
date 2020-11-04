import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import {
  propsFactory,
  webhooks,
} from '../../../__tests__/WebhooksIndexPage.fixtures';
import WrappedWebhooksTable from '../index';

const props = {
  fetchAndPush: () => {},
  onDeleteClick: () => {},
  setToDelete: () => {},
  itemCount: 0,
  canCreate: true,
};

const fixtures = {
  'should render when loading': propsFactory({
    ...props,
    isLoading: true,
    hasData: false,
    hasError: false,
    toasts: [],
  }),
  'should render with no data': propsFactory({
    ...props,
    isLoading: false,
    hasData: false,
    hasError: false,
    toasts: [],
  }),
  'should render with error': propsFactory({
    isLoading: false,
    hasData: false,
    hasError: true,
    message: {
      type: 'error',
      text: 'this is error',
    },
    ...props,
    toasts: [],
  }),
  'should render with webhooks': propsFactory({
    ...props,
    isLoading: false,
    hasError: false,
    hasData: true,
    toasts: [],
    webhooks,
    itemCount: webhooks.length,
  }),
};

describe('WebhooksTable', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(WrappedWebhooksTable, fixtures));
});
