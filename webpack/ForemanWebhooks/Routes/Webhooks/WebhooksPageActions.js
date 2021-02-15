import history from 'foremanReact/history';
import { get } from 'foremanReact/redux/API';
import { stringifyParams, getParams } from 'foremanReact/common/urlHelpers';

import { buildQuery } from './WebhooksPageHelpers';
import {
  WEBHOOKS_API_PATH,
  WEBHOOKS_PATH,
  WEBHOOKS_API_REQUEST_KEY,
} from './constants';

export const initializeWebhooks = () => dispatch => {
  const params = getParams();
  dispatch(fetchWebhooks(params));
  if (!history.action === 'POP') {
    history.replace({
      pathname: WEBHOOKS_PATH,
      search: stringifyParams(params),
    });
  }
};

export const fetchWebhooks = (
  { page, perPage, searchQuery, sort },
  url = WEBHOOKS_API_PATH
) => async dispatch => {
  const sortString =
    sort && Object.keys(sort).length > 0 ? `${sort.by} ${sort.order}` : '';

  return dispatch(
    get({
      key: WEBHOOKS_API_REQUEST_KEY,
      url,
      params: {
        page,
        per_page: perPage,
        search: searchQuery,
        order: sortString,
      },
    })
  );
};

export const fetchAndPush = (params = {}) => (dispatch, getState) => {
  const query = buildQuery(params, getState());
  dispatch(fetchWebhooks(query));
  history.push({
    pathname: WEBHOOKS_PATH,
    search: stringifyParams(query),
  });
};

export const reloadWithSearch = query =>
  fetchAndPush({ searchQuery: query, page: 1 });
