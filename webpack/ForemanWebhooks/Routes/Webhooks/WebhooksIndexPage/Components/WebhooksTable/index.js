import React from 'react';
import PropTypes from 'prop-types';

import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import WebhooksTable from './WebhooksTable';
import {
  WEBHOOK_DELETE_MODAL_ID,
  WEBHOOK_EDIT_MODAL_ID,
} from '../../../constants';

const WrappedWebhooksTable = props => {
  const { setModalOpen: setDeleteModalOpen } = useForemanModal({
    id: WEBHOOK_DELETE_MODAL_ID,
  });

  const { setModalOpen: setEditModalOpen } = useForemanModal({
    id: WEBHOOK_EDIT_MODAL_ID,
  });

  const { setToDelete, setToEdit, ...rest } = props;

  const onDeleteClick = rowData => {
    setToDelete(rowData);
    setDeleteModalOpen();
  };

  const onEditClick = rowData => {
    setToEdit(rowData);
    setEditModalOpen();
  };

  return (
    <WebhooksTable
      onDeleteClick={onDeleteClick}
      onEditClick={onEditClick}
      {...rest}
    />
  );
};

WrappedWebhooksTable.propTypes = {
  setToDelete: PropTypes.func.isRequired,
  setToEdit: PropTypes.func.isRequired,
};

export default WrappedWebhooksTable;
