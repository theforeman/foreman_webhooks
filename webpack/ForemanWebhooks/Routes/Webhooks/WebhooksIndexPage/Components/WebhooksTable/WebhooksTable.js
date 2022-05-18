import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import { Table } from 'foremanReact/components/common/table';
import Pagination from 'foremanReact/components/Pagination';
import Loading from 'foremanReact/components/Loading';
import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import WebhookDeleteModal from '../WebhookDeleteModal';
import WebhookEditModal from '../WebhookEditModal';
import EmptyWebhooksTable from './Components/EmptyWebhooksTable';

import createWebhooksTableSchema from './WebhooksTableSchema';

import { WEBHOOK_EDIT_MODAL_ID } from '../../../constants';

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
  onDeleteClick,
  toEdit,
  onEditClick,
  reloadWithSearch,
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
    const currentPage = page;
    const maxPage = Math.ceil((itemCount - 1) / perPage);
    fetchAndPush({ page: maxPage < currentPage ? maxPage : currentPage });
  };

  const { setModalClosed: setEditModalClosed } = useForemanModal({
    id: WEBHOOK_EDIT_MODAL_ID,
  });

  if (isLoading && !hasError) return <Loading />;

  if (!isLoading && !hasData && isEmpty(search)) {
    return <EmptyWebhooksTable message={message} />;
  }

  return (
    <React.Fragment>
      <WebhookDeleteModal toDelete={toDelete} onSuccess={onDeleteSuccess} />
      <WebhookEditModal
        toEdit={toEdit}
        onSuccess={() => {
          setEditModalClosed();
          reloadWithSearch(search);
        }}
        onCancel={setEditModalClosed}
      />
      <Table
        key="webhooks-table"
        columns={createWebhooksTableSchema(
          fetchAndPush,
          sort.by,
          sort.order,
          onDeleteClick,
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
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  toDelete: PropTypes.object.isRequired,
  toEdit: PropTypes.number.isRequired,
  reloadWithSearch: PropTypes.func.isRequired,
};

export default WebhooksTable;
