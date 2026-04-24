import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectWebhooks } from '../../../WebhooksPageSelectors';

function MockForemanTableIndexPage({ header, customCreateAction }) {
  const rows = useSelector(selectWebhooks);
  const onCreate = customCreateAction ? customCreateAction() : undefined;
  return (
    <div data-testid="webhooks-table-index">
      <h1>{header}</h1>
      <ul aria-label="webhook-rows">
        {rows.map(row => (
          <li key={row.id}>{row.name}</li>
        ))}
      </ul>
      {onCreate ? (
        <button type="button" onClick={onCreate}>
          Create new
        </button>
      ) : null}
    </div>
  );
}

MockForemanTableIndexPage.propTypes = {
  header: PropTypes.string,
  customCreateAction: PropTypes.func,
};

MockForemanTableIndexPage.defaultProps = {
  header: '',
  customCreateAction: null,
};

export default MockForemanTableIndexPage;
