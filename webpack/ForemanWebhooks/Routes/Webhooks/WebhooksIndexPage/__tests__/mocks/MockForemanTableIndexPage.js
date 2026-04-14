import React from 'react';
import PropTypes from 'prop-types';

function MockForemanTableIndexPage({ header, customCreateAction, rows = [] }) {
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
  rows: PropTypes.arrayOf(PropTypes.object),
};

MockForemanTableIndexPage.defaultProps = {
  header: '',
  customCreateAction: null,
  rows: [],
};

export default MockForemanTableIndexPage;
