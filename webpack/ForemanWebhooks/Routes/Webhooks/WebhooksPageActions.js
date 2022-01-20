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
  dispatch(fetchWebhooks({ per_page: params.perPage, ...params }));
  if (!history.action === 'POP') {
    history.replace({
      pathname: WEBHOOKS_PATH,
      search: stringifyParams(params),
    });
  }
};

export const fetchWebhooks = (
  /* eslint-disable-next-line camelcase */
  { page, per_page, searchQuery, sort },
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
        per_page,
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
    search: stringifyParams({ perPage: query.per_page, ...query }),
  });
};

export const reloadWithSearch = query =>
  fetchAndPush({ searchQuery: query, page: 1 });
