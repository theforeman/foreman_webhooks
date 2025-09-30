import React from 'react';
import PropTypes from 'prop-types';

import { APIActions } from 'foremanReact/redux/API';
import { useDispatch } from 'react-redux';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { Modal, Button, ModalVariant } from '@patternfly/react-core';

import { WEBHOOK_DELETE_MODAL_ID } from '../../constants';

const WebhookDeleteModal = ({ toDelete, onSuccess, modalState }) => {
  const { id, name } = toDelete;

  const dispatch = useDispatch();
  const handleSubmit = () =>
    dispatch(
      APIActions.delete({
        url: foremanUrl(`/api/v2/webhooks/${id}`),
        key: WEBHOOK_DELETE_MODAL_ID,
        successToast: () =>
          sprintf(__('Webhook %s was successfully deleted'), name),
        errorToast: response =>
          // eslint-disable-next-line camelcase
          response?.response?.data?.error?.full_messages?.[0] || response,
        handleSuccess: onSuccess,
      })
    );

  return (
    <Modal
      position="top"
      variant={ModalVariant.small}
      id={WEBHOOK_DELETE_MODAL_ID}
      ouiaId={WEBHOOK_DELETE_MODAL_ID}
      title={__('Confirm Webhook Deletion')}
      isOpen={modalState.isOpen}
      onClose={modalState.closeModal}
      description={sprintf(
        __('You are about to delete %s. Are you sure?'),
        name
      )}
      actions={[
        <Button
          ouiaId="submitBtn"
          key="confirm"
          variant="danger"
          onClick={handleSubmit}
        >
          {__('Delete')}
        </Button>,
        <Button
          ouiaId="cancelBtn"
          key="cancel"
          variant="link"
          onClick={modalState.closeModal}
        >
          {__('Cancel')}
        </Button>,
      ]}
    />
  );
};

WebhookDeleteModal.propTypes = {
  toDelete: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  modalState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
};

WebhookDeleteModal.defaultProps = {
  toDelete: {},
};

export default WebhookDeleteModal;
