import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'patternfly-react';

import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';
import { withRenderHandler } from 'foremanReact/common/HOC';

import { WEBHOOKS_SEARCH_PROPS, WEBHOOK_CREATE_MODAL_ID } from '../constants';

import WebhooksTable from './Components/WebhooksTable';
import WebhookCreateModal from './Components/WebhookCreateModal';
import EmptyWebhooksIndexPage from './Components/EmptyWebhooksIndexPage';

const WebhooksIndexPage = ({
  fetchAndPush,
  search,
  isLoading,
  hasData,
  webhooks,
  page,
  perPage,
  sort,
  hasError,
  itemCount,
  message,
  canCreate,
  toasts,
  reloadWithSearch,
}) => {
  const [toDelete, setToDelete] = useState({});
  const [toEdit, setToEdit] = useState(0);

  const {
    setModalOpen: setCreateModalOpen,
    setModalClosed: setCreateModalClosed,
  } = useForemanModal({
    id: WEBHOOK_CREATE_MODAL_ID,
  });

  const createBtn = (
    <Button onClick={setCreateModalOpen} bsStyle="primary">
      {__('Create Webhook')}
    </Button>
  );

  return (
    <>
      <WebhookCreateModal
        onSuccess={() => {
          setCreateModalClosed();
          reloadWithSearch(search);
        }}
        onCancel={setCreateModalClosed}
      />
      <PageLayout
        header={__('Webhooks')}
        searchable={!isLoading}
        searchProps={WEBHOOKS_SEARCH_PROPS}
        searchQuery={search}
        isLoading={isLoading && hasData}
        onSearch={reloadWithSearch}
        onBookmarkClick={reloadWithSearch}
        toastNotifications={toasts}
        toolbarButtons={canCreate && createBtn}
      >
        <WebhooksTable
          results={webhooks}
          fetchAndPush={fetchAndPush}
          pagination={{ page, perPage }}
          itemCount={itemCount}
          sort={sort}
          toDelete={toDelete}
          setToDelete={setToDelete}
          hasData={hasData}
          hasError={hasError}
          isLoading={isLoading}
          toEdit={toEdit}
          setToEdit={setToEdit}
          reloadWithSearch={reloadWithSearch}
        />
      </PageLayout>
    </>
  );
};

WebhooksIndexPage.propTypes = {
  fetchAndPush: PropTypes.func.isRequired,
  search: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  hasData: PropTypes.bool.isRequired,
  webhooks: PropTypes.array.isRequired,
  page: PropTypes.number,
  perPage: PropTypes.number,
  sort: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
  itemCount: PropTypes.number.isRequired,
  message: PropTypes.object,
  canCreate: PropTypes.bool.isRequired,
  toasts: PropTypes.array.isRequired,
  reloadWithSearch: PropTypes.func.isRequired,
};

WebhooksIndexPage.defaultProps = {
  page: null,
  perPage: null,
  search: '',
  message: { type: 'empty', text: __('Try to create a new Webhook') },
};

export default withRenderHandler({
  Component: WebhooksIndexPage,
  EmptyComponent: EmptyWebhooksIndexPage,
  ErrorComponent: EmptyWebhooksIndexPage,
});
