import React from 'react';
import PropTypes from 'prop-types';

import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import WebhooksTable from './WebhooksTable';
import { WEBHOOK_DELETE_MODAL_ID } from '../../../constants';

const WrappedWebhooksTable = props => {
  const { setModalOpen } = useForemanModal({ id: WEBHOOK_DELETE_MODAL_ID });
  const { setToDelete, ...rest } = props;

  const onDeleteClick = rowData => {
    setToDelete(rowData);
    setModalOpen();
  };

  return <WebhooksTable {...rest} onDeleteClick={onDeleteClick} />;
};

WrappedWebhooksTable.propTypes = {
  setToDelete: PropTypes.func.isRequired,
};

export default WrappedWebhooksTable;
