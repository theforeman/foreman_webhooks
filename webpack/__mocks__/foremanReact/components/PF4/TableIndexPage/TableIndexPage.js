import React from 'react';
import PropTypes from 'prop-types';

/** Minimal stub — real TableIndexPage uses columns/rows, not always children. */
const TableIndexPage = ({
  children = null,
  header,
  columns,
  rows,
  controller,
  apiUrl,
  apiOptions,
  customCreateAction,
  id,
}) => (
  <div data-testid="table-index-page" id={id}>
    {header ? <h1>{header}</h1> : null}
    {children}
    {rows && rows.length > 0 ? (
      <ul data-testid="table-index-rows">
        {rows.map(row => (
          <li key={row.id}>{row.name}</li>
        ))}
      </ul>
    ) : null}
  </div>
);

TableIndexPage.propTypes = {
  children: PropTypes.node,
  header: PropTypes.string,
  columns: PropTypes.object,
  rows: PropTypes.array,
  controller: PropTypes.string,
  apiUrl: PropTypes.string,
  apiOptions: PropTypes.object,
  customCreateAction: PropTypes.func,
  id: PropTypes.string,
};

TableIndexPage.defaultProps = {
  children: null,
  header: '',
  columns: {},
  rows: [],
  controller: '',
  apiUrl: '',
  apiOptions: {},
  customCreateAction: null,
  id: undefined,
};

export default TableIndexPage;
