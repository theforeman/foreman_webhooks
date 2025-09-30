import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import { Table } from 'foremanReact/components/common/table';
import Pagination from 'foremanReact/components/Pagination';
import Loading from 'foremanReact/components/Loading';

import WebhookDeleteModal from '../WebhookDeleteModal';
import WebhookEditModal from '../WebhookEditModal';
import WebhookTestModal from '../WebhookTestModal';
import EmptyWebhooksTable from './Components/EmptyWebhooksTable';

import createWebhooksTableSchema from './WebhooksTableSchema';

import {
  selectWebhooks,
  selectPage,
  selectPerPage,
  selectSearch,
  selectSort,
  selectHasData,
  selectHasError,
  selectIsLoading,
  selectSubtotal,
  selectMessage,
} from '../../../WebhooksPageSelectors';

const WebhooksTable = ({
  fetchAndPush,
  toDelete,
  toTest,
  toEdit,
  onEditClick,
  reloadWithSearch,
  webhookActions,
  modalsStates,
}) => {
  const webhooks = useSelector(selectWebhooks);
  const page = useSelector(selectPage);
  const perPage = useSelector(selectPerPage);
  const search = useSelector(selectSearch);
  const sort = useSelector(selectSort);
  const isLoading = useSelector(selectIsLoading);
  const hasData = useSelector(selectHasData);
  const hasError = useSelector(selectHasError);
  const itemCount = useSelector(selectSubtotal);
  const message = useSelector(selectMessage);

  const onDeleteSuccess = () => {
    modalsStates.deleteModal.closeModal();
    const currentPage = page;
    const maxPage = Math.ceil((itemCount - 1) / perPage);
    fetchAndPush({ page: maxPage < currentPage ? maxPage : currentPage });
  };

  if (isLoading && !hasError) return <Loading />;

  if (!isLoading && !hasData && isEmpty(search)) {
    return <EmptyWebhooksTable message={message} />;
  }

  return (
    <React.Fragment>
      <WebhookDeleteModal
        toDelete={toDelete}
        onSuccess={onDeleteSuccess}
        modalState={modalsStates.deleteModal}
      />
      <WebhookEditModal
        toEdit={toEdit}
        onSuccess={() => {
          modalsStates.editModal.closeModal();
          reloadWithSearch(search);
        }}
        modalState={modalsStates.editModal}
      />
      <WebhookTestModal toTest={toTest} modalState={modalsStates.testModal} />
      <Table
        key="webhooks-table"
        columns={createWebhooksTableSchema(
          fetchAndPush,
          sort.by,
          sort.order,
          webhookActions,
          onEditClick
        )}
        rows={webhooks}
        id="webhooks-table"
      />
      <Pagination itemCount={itemCount} onChange={fetchAndPush} />
    </React.Fragment>
  );
};

WebhooksTable.propTypes = {
  fetchAndPush: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  toDelete: PropTypes.object.isRequired,
  toTest: PropTypes.object.isRequired,
  toEdit: PropTypes.number.isRequired,
  reloadWithSearch: PropTypes.func.isRequired,
  webhookActions: PropTypes.object.isRequired,
  modalsStates: PropTypes.shape({
    deleteModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      closeModal: PropTypes.func.isRequired,
    }).isRequired,
    editModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      closeModal: PropTypes.func.isRequired,
    }).isRequired,
    testModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      closeModal: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default WebhooksTable;
