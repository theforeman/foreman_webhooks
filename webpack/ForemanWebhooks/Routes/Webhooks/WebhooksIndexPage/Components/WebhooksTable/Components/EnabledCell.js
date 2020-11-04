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

export default EnabledCell;
