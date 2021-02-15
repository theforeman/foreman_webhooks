import React from 'react';
import NameToEditCell from '../NameToEditCell';

const nameToEditFormatter = (controllerPluralize, onClick) => (
  value,
  { rowData: { canEdit, id, name } }
) => (
  <NameToEditCell
    active={canEdit}
    id={id}
    name={encodeURI(name)}
    controller={controllerPluralize}
    onClick={onClick}
  >
    {value}
  </NameToEditCell>
);

export default nameToEditFormatter;
