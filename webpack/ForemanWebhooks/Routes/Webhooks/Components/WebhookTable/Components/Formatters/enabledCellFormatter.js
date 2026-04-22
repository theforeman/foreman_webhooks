import React from 'react';
import PropTypes from 'prop-types';
import { CheckIcon, BanIcon } from '@patternfly/react-icons';

const EnabledCell = ({ condition }) =>
  condition ? <CheckIcon /> : <BanIcon />;

EnabledCell.propTypes = {
  condition: PropTypes.bool,
};

EnabledCell.defaultProps = {
  condition: false,
};

const enabledCellFormatter = () => (value, extra) => {
  const condition = extra?.rowData != null ? value : value?.enabled;
  return <EnabledCell condition={Boolean(condition)} />;
};

export default enabledCellFormatter;
