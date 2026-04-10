import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import { translate as __ } from 'foremanReact/common/I18n';

import {
  WEBHOOKS_API_REQUEST_KEY,
  WEBHOOKS_API_PLAIN_PATH,
} from '../constants';

import {
  selectWebhooks,
  selectPage,
  selectPerPage,
  selectSearch,
  selectSubtotal,
} from '../WebhooksPageSelectors';

import WebhookCreateModal from './Components/WebhookCreateModal';
import WebhookDeleteModal from './Components/WebhookDeleteModal';
import WebhookEditModal from './Components/WebhookEditModal';
import WebhookTestModal from './Components/WebhookTestModal';
import {
  nameToEditFormatter,
  enabledCellFormatter,
  actionCellFormatter,
} from '../Components/WebhookTable/Components/Formatters';

import { reloadWithSearch, fetchAndPush } from '../WebhooksPageActions';

const WebhooksIndexPage = () => {
  const dispatch = useDispatch();

  const search = useSelector(selectSearch);
  const webhooks = useSelector(selectWebhooks);
  const page = useSelector(selectPage);
  const perPage = useSelector(selectPerPage);
  const itemCount = useSelector(selectSubtotal);

  const [toDelete, setToDelete] = useState({});
  const [toTest, setToTest] = useState({});
  const [toEdit, setToEdit] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openModal = () => {
    setIsCreateModalOpen(true);
  };

  const onEditClick = rowData => {
    setToEdit(rowData);
    setIsEditModalOpen(true);
  };

  const onTestClick = rowData => {
    setToTest(rowData);
    setIsTestModalOpen(true);
  };

  const onDeleteClick = rowData => {
    setToDelete(rowData);
    setIsDeleteModalOpen(true);
  };

  const webhookActions = {
    deleteWebhook: (id, name) => {
      onDeleteClick({ id, name });
    },
    testWebhook: (id, name) => {
      onTestClick({ id, name });
    },
  };

  const modalsStates = {
    testModal: {
      isOpen: isTestModalOpen,
      closeModal: () => {
        setToTest({});
        setIsTestModalOpen(false);
      },
    },
    deleteModal: {
      isOpen: isDeleteModalOpen,
      closeModal: () => {
        setToDelete({});
        setIsDeleteModalOpen(false);
      },
    },
    editModal: {
      isOpen: isEditModalOpen,
      closeModal: () => {
        setToEdit(0);
        setIsEditModalOpen(false);
      },
    },
  };

  const columns = {
    name: {
      title: __('Name'),
      wrapper: nameToEditFormatter('webhooks', onEditClick),
      isSorted: true,
    },
    target_url: {
      title: __('Target URL'),
      isSorted: true,
    },
    enabled: {
      title: __('Enabled'),
      wrapper: enabledCellFormatter(),
      isSorted: true,
    },
    actions: {
      title: __('Actions'),
      wrapper: actionCellFormatter(webhookActions),
    },
  };

  const onDeleteSuccess = () => {
    modalsStates.deleteModal.closeModal();
    const currentPage = page;
    const maxPage = Math.ceil((itemCount - 1) / perPage);
    dispatch(
      fetchAndPush({ page: maxPage < currentPage ? maxPage : currentPage })
    );
  };

  return (
    <>
      <WebhookCreateModal
        isOpen={isCreateModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          dispatch(reloadWithSearch(search));
        }}
        onCancel={() => setIsCreateModalOpen(false)}
      />
      <WebhookDeleteModal
        toDelete={toDelete}
        onSuccess={onDeleteSuccess}
        modalState={modalsStates.deleteModal}
      />
      <WebhookEditModal
        toEdit={toEdit}
        onSuccess={() => {
          modalsStates.editModal.closeModal();
          dispatch(reloadWithSearch(search));
        }}
        modalState={modalsStates.editModal}
      />
      <WebhookTestModal toTest={toTest} modalState={modalsStates.testModal} />

      <TableIndexPage
        header={__('Webhooks')}
        controller="webhooks"
        apiUrl={WEBHOOKS_API_PLAIN_PATH}
        apiOptions={{ key: WEBHOOKS_API_REQUEST_KEY }}
        customCreateAction={() => openModal}
        columns={columns}
        rows={webhooks}
        id="webhooks-table"
        key="webhooks-table"
      />
    </>
  );
};

export default WebhooksIndexPage;
