import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'patternfly-react';

import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { foremanUrl } from 'foremanReact/common/helpers';

import { WEBHOOKS_SEARCH_PROPS, WEBHOOKS_PATH } from '../constants';
import WebhooksTable from './Components/WebhooksTable';

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
}) => {
  const handleSearch = query => fetchAndPush({ searchQuery: query, page: 1 });
  const [toDelete, setToDelete] = useState({});
  const createBtn = (
    <Link to={foremanUrl(`${WEBHOOKS_PATH}/new`)}>
      <Button bsStyle="primary">{__('Create Webhook')}</Button>
    </Link>
  );
  return (
    <PageLayout
      header={__('Webhooks')}
      searchable={!isLoading}
      searchProps={WEBHOOKS_SEARCH_PROPS}
      searchQuery={search}
      isLoading={isLoading && hasData}
      onSearch={handleSearch}
      onBookmarkClick={handleSearch}
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
        message={message}
        hasData={hasData}
        hasError={hasError}
        isLoading={isLoading}
      />
    </PageLayout>
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
};

WebhooksIndexPage.defaultProps = {
  page: null,
  perPage: null,
  search: '',
  message: { type: 'empty', text: __('Try to create a new Webhook') },
};

export default WebhooksIndexPage;
