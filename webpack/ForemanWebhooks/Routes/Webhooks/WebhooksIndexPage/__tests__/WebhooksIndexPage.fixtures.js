import { WEBHOOKS_API_REQUEST_KEY } from '../../constants';

export const pickedQuery = { by: 'default_name', order: 'ASC' };

const searchString = 'name=foo';

const stateSearch = { search: searchString };

const querySearch = { searchQuery: searchString };

export const querySort = {
  sort: {
    by: 'defaultName',
    order: 'ASC',
  },
};

const pageParams = {
  page: 5,
  perPage: 42,
};

const stateParams = {
  ...pageParams,
  ...stateSearch,
  ...querySort,
};

export const resultParams = {
  ...pageParams,
  ...querySearch,
  sort: pickedQuery,
};

export const queryParams = {
  ...pageParams,
  ...querySearch,
  ...querySort,
};

export const stateFactory = state => ({
  API: {
    [WEBHOOKS_API_REQUEST_KEY]: {
      response: {
        ...stateParams,
        ...state,
      },
    },
  },
});

export const propsFactory = (state = {}) => ({
  ...stateParams,
  ...state,
});

export const webhooks = [
  {
    id: 1,
    name: 'my-webhook',
    targetUrl: 'https://my-machine.example.com',
    canEdit: true,
    canDelete: true,
    enabled: true,
  },
  {
    id: 2,
    name: 'your-webhook',
    targetUrl: 'https://your-machine.example.com',
    canEdit: false,
    canDelete: false,
    enabled: false,
  },
];

export const spySelector = selectors => {
  jest.spyOn(selectors, 'selectIsLoading');
  jest.spyOn(selectors, 'selectHasError');
  jest.spyOn(selectors, 'selectWebhooks');
  jest.spyOn(selectors, 'selectHasData');
  jest.spyOn(selectors, 'selectPage');
  jest.spyOn(selectors, 'selectPerPage');
  jest.spyOn(selectors, 'selectSearch');
  jest.spyOn(selectors, 'selectSort');
  jest.spyOn(selectors, 'selectCanCreate');
  jest.spyOn(selectors, 'selectSubtotal');
  jest.spyOn(selectors, 'selectMessage');

  selectors.selectIsLoading.mockImplementation(() => false);
  selectors.selectHasError.mockImplementation(() => false);
  selectors.selectWebhooks.mockImplementation(() => []);
  selectors.selectHasData.mockImplementation(() => true);
  selectors.selectPage.mockImplementation(() => 1);
  selectors.selectPerPage.mockImplementation(() => 20);
  selectors.selectSearch.mockImplementation(() => '');
  selectors.selectSort.mockImplementation(() => ({ by: '', order: '' }));
  selectors.selectCanCreate.mockImplementation(() => true);
  selectors.selectSubtotal.mockImplementation(() => 0);
  selectors.selectMessage.mockImplementation(() => ({}));
};

export const spyEditSelector = selectors => {
  jest.spyOn(selectors, 'selectIsLoading');
  jest.spyOn(selectors, 'selectWebhookValues');
  jest.spyOn(selectors, 'selectWebhookTemplateId');

  selectors.selectIsLoading.mockImplementation(() => false);
  selectors.selectWebhookValues.mockImplementation(() => ({}));
  selectors.selectWebhookTemplateId.mockImplementation(() => 1);
};
