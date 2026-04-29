import React from 'react';
import { cellFormatter } from 'foremanReact/components/common/table';
import { ActionButton } from '../ActionButtons/ActionButton';

const actionCellFormatter = webhookActions => (value, extra) => {
  const row = extra?.rowData ?? value;
  const canEdit = row.canEdit ?? row.can_edit;
  const canDelete = row.canDelete ?? row.can_delete;
  const { id, name } = row;

  const content = canEdit && (
    <ActionButton
      canDelete={canDelete}
      id={id}
      name={name}
      webhookActions={webhookActions}
    />
  );

  return extra?.rowData != null ? cellFormatter(content) : content;
};

export default actionCellFormatter;
