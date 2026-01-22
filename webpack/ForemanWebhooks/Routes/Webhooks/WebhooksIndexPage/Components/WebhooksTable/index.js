import React, { useState } from 'react';
import PropTypes from 'prop-types';

import WebhooksTable from './WebhooksTable';

const WrappedWebhooksTable = props => {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { setToDelete, setToEdit, setToTest, ...rest } = props;

  const onDeleteClick = rowData => {
    setToDelete(rowData);
    setIsDeleteModalOpen(true);
  };

  const onEditClick = rowData => {
    setToEdit(rowData);
    setIsEditModalOpen(true);
  };

  const onTestClick = rowData => {
    setToTest(rowData);
    setIsTestModalOpen(true);
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
      modalsStates={{
        testModal: {
          isOpen: isTestModalOpen,
          closeModal: () => setIsTestModalOpen(false),
        },
        deleteModal: {
          isOpen: isDeleteModalOpen,
          closeModal: () => setIsDeleteModalOpen(false),
        },
        editModal: {
          isOpen: isEditModalOpen,
          closeModal: () => setIsEditModalOpen(false),
        },
      }}
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
