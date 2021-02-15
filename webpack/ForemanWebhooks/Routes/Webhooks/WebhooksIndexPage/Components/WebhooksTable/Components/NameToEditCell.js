import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';

const NameToEditCell = ({ active, id, name, controller, onClick, children }) =>
  active ? (
    <Button
      variant="link"
      isInline
      component="span"
      onClick={() => onClick(id)}
    >
      {children}
    </Button>
  ) : (
    <Button variant="link" isInline isDisabled component="span">
      {children}
    </Button>
  );

NameToEditCell.propTypes = {
  active: PropTypes.bool,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  controller: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

NameToEditCell.defaultProps = {
  active: false,
  children: null,
};

export default NameToEditCell;
