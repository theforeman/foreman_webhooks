import React from 'react';
import { cellFormatter } from 'foremanReact/components/common/table';
import { ActionButton } from '../ActionButtons/ActionButton';

const actionCellFormatter = webhookActions => (
  _,
  { rowData: { id, name, canEdit, canDelete } }
) =>
  cellFormatter(
    canEdit && (
      <ActionButton
        canDelete={canDelete}
        id={id}
        name={name}
        webhookActions={webhookActions}
      />
    )
  );

export default actionCellFormatter;
