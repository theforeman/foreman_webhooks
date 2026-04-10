import React from 'react';
import NameToEditCell from '../NameToEditCell';

const nameToEditFormatter = (controllerPluralize, onClick) => (
  value,
  extra
) => {
  const row = extra?.rowData ?? value;
  const canEdit = row.canEdit ?? row.can_edit;
  const { id, name } = row;
  const label = extra?.rowData != null ? value : name;

  return (
    <NameToEditCell
      active={canEdit}
      id={id}
      name={encodeURI(name)}
      controller={controllerPluralize}
      onClick={onClick}
    >
      {label}
    </NameToEditCell>
  );
};

export default nameToEditFormatter;
