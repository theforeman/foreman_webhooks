import React from 'react';
import PropTypes from 'prop-types';

const TableIndexPage = ({ children }) => <div>{children}</div>;

TableIndexPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TableIndexPage;
