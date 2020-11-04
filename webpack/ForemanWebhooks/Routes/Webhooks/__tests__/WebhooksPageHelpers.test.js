import { pickSort, buildQuery } from '../WebhooksPageHelpers';

import {
  querySort,
  pickedQuery,
  queryParams,
  resultParams,
} from '../WebhooksIndexPage/__tests__/WebhooksIndexPage.fixtures';

describe('pickSort', () => {
  it('should pick sort from query', () => {
    expect(pickSort(querySort, {})).toStrictEqual(pickedQuery);
  });
});

describe('buildQuery', () => {
  it('should return params from query if present', () => {
    expect(buildQuery(queryParams, {})).toStrictEqual(resultParams);
  });
});
