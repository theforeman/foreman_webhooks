import React from 'react';
import PropTypes from 'prop-types';

import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import WebhooksTable from './WebhooksTable';
import {
  WEBHOOK_DELETE_MODAL_ID,
  WEBHOOK_EDIT_MODAL_ID,
  WEBHOOK_TEST_MODAL_ID,
} from '../../../constants';

const WrappedWebhooksTable = props => {
  const { setModalOpen: setDeleteModalOpen } = useForemanModal({
    id: WEBHOOK_DELETE_MODAL_ID,
  });

  const { setModalOpen: setEditModalOpen } = useForemanModal({
    id: WEBHOOK_EDIT_MODAL_ID,
  });

  const { setModalOpen: setTestModalOpen } = useForemanModal({
    id: WEBHOOK_TEST_MODAL_ID,
  });

  const { setToDelete, setToEdit, setToTest, ...rest } = props;

  const onDeleteClick = rowData => {
    setToDelete(rowData);
    setDeleteModalOpen();
  };

  const onEditClick = rowData => {
    setToEdit(rowData);
    setEditModalOpen();
  };

  const onTestClick = rowData => {
    setToTest(rowData);
    setTestModalOpen();
  };

  const webhookActions = {
    deleteWebhook: (id, name) => {
      onDeleteClick({ id, name });
    },
    testWebhook: (id, name) => {
      onTestClick({ id, name });
    },
  };

  return (
    <WebhooksTable
      onEditClick={onEditClick}
      onTestClick={onTestClick}
      webhookActions={webhookActions}
      {...rest}
    />
  );
};

WrappedWebhooksTable.propTypes = {
  setToDelete: PropTypes.func.isRequired,
  setToEdit: PropTypes.func.isRequired,
  setToTest: PropTypes.func.isRequired,
};

export default WrappedWebhooksTable;
