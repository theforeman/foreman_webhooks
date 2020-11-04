import React from 'react';
import PropTypes from 'prop-types';

import { translate as __ } from 'foremanReact/common/I18n';
import { Table } from 'foremanReact/components/common/table';
import Pagination from 'foremanReact/components/Pagination/PaginationWrapper';
import { withRenderHandler } from 'foremanReact/common/HOC';

import WebhookDeleteModal from '../WebhookDeleteModal';
import EmptyWebhooksTable from '../EmptyWebhooksTable';

import createWebhooksTableSchema from './WebhooksTableSchema';

const WebhooksTable = ({
  fetchAndPush,
  itemCount,
  results,
  sort,
  pagination,
  toDelete,
  onDeleteClick,
  message,
}) => {
  const onSuccess = () => {
    const currentPage = pagination.page;
    const maxPage = Math.ceil((itemCount - 1) / pagination.perPage);
    fetchAndPush({ page: maxPage < currentPage ? maxPage : currentPage });
  };
  return (
    <React.Fragment>
      <WebhookDeleteModal toDelete={toDelete} onSuccess={onSuccess} />
      <Table
        key="webhooks-table"
        columns={createWebhooksTableSchema(
          fetchAndPush,
          sort.by,
          sort.order,
          onDeleteClick
        )}
        rows={results}
        id="webhooks-table"
        style={{ marginBottom: -6 }}
      />
      <Pagination
        viewType="list"
        itemCount={itemCount}
        pagination={pagination}
        onChange={fetchAndPush}
        dropdownButtonId="webhooks-page-pagination-dropdown"
      />
    </React.Fragment>
  );
};

WebhooksTable.propTypes = {
  results: PropTypes.array.isRequired,
  fetchAndPush: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  sort: PropTypes.object,
  pagination: PropTypes.object.isRequired,
  toDelete: PropTypes.object.isRequired,
  message: PropTypes.object,
};

WebhooksTable.defaultProps = {
  sort: { by: '', order: '' },
  message: { type: 'empty', text: __('Try to create a new Webhook') },
};

export default withRenderHandler({
  Component: WebhooksTable,
  EmptyComponent: EmptyWebhooksTable,
  ErrorComponent: EmptyWebhooksTable,
});
