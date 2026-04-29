import React from 'react';
import { Button } from '@patternfly/react-core';

const nameToEditFormatter = onClick => (value, extra) => {
  const row = extra?.rowData ?? value;
  const canEdit = row.canEdit ?? row.can_edit;
  const { id } = row;
  const label = extra?.rowData != null ? value : row.name;

  return canEdit ? (
    <Button
      ouiaId="name-edit-active-button"
      variant="link"
      isInline
      component="span"
      onClick={() => onClick(id)}
    >
      {label}
    </Button>
  ) : (
    <Button
      ouiaId="name-edit-disabled-button"
      variant="link"
      isInline
      isDisabled
      component="span"
    >
      {label}
    </Button>
  );
};

export default nameToEditFormatter;
