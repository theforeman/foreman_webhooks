import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import {
  WEBHOOKS_API_PATH,
  WEBHOOKS_API_REQUEST_KEY,
  WEBHOOK_CREATE_MODAL_ID,
} from '../constants';

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

  const {
    setModalOpen: setCreateModalOpen,
    setModalClosed: setCreateModalClosed,
  } = useForemanModal({
    id: WEBHOOK_CREATE_MODAL_ID,
  });

  return (
    <>
      <WebhookCreateModal
        onSuccess={() => {
          setCreateModalClosed();
          dispatch(reloadWithSearch(search));
        }}
        onCancel={setCreateModalClosed}
      />
      <TableIndexPage
        header={__('Webhooks')}
        controller="webhooks"
        apiUrl={WEBHOOKS_API_PATH}
        apiOptions={{ key: WEBHOOKS_API_REQUEST_KEY }}
        customCreateAction={() => setCreateModalOpen}
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
