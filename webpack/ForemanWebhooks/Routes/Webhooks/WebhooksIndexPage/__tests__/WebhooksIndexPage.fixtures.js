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
