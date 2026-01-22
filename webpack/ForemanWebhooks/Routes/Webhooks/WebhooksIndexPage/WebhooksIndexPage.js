import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import { translate as __ } from 'foremanReact/common/I18n';

import { WEBHOOKS_API_PATH, WEBHOOKS_API_REQUEST_KEY } from '../constants';

import { selectSearch } from '../WebhooksPageSelectors';

import WebhooksTable from './Components/WebhooksTable';
import WebhookCreateModal from './Components/WebhookCreateModal';

import { reloadWithSearch, fetchAndPush } from '../WebhooksPageActions';

const WebhooksIndexPage = () => {
  const dispatch = useDispatch();

  const search = useSelector(selectSearch);

  const [toDelete, setToDelete] = useState({});
  const [toTest, setToTest] = useState({});
  const [toEdit, setToEdit] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openModal = () => {
    setIsCreateModalOpen(true);
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
      <TableIndexPage
        header={__('Webhooks')}
        controller="webhooks"
        apiUrl={WEBHOOKS_API_PATH}
        apiOptions={{ key: WEBHOOKS_API_REQUEST_KEY }}
        customCreateAction={() => openModal}
      >
        <WebhooksTable
          fetchAndPush={params => dispatch(fetchAndPush(params))}
          toDelete={toDelete}
          setToDelete={setToDelete}
          toEdit={toEdit}
          setToEdit={setToEdit}
          toTest={toTest}
          setToTest={setToTest}
          reloadWithSearch={query => dispatch(reloadWithSearch(query))}
        />
      </TableIndexPage>
    </>
  );
};

export default WebhooksIndexPage;
