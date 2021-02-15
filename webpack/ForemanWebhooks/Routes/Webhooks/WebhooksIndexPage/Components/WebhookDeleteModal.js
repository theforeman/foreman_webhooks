import React from 'react';
import PropTypes from 'prop-types';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import ForemanModal from 'foremanReact/components/ForemanModal';
import { foremanUrl } from 'foremanReact/common/helpers';

import { WEBHOOK_DELETE_MODAL_ID } from '../../constants';

const WebhookDeleteModal = ({ toDelete, onSuccess }) => {
  const { id, name } = toDelete;

  return (
    <ForemanModal
      id={WEBHOOK_DELETE_MODAL_ID}
      title={__('Confirm Webhook Deletion')}
      backdrop="static"
      enforceFocus
      submitProps={{
        url: foremanUrl(`/api/v2/webhooks/${id}`),
        message: sprintf(__('Webhook %s was successfully deleted'), name),
        onSuccess,
        submitBtnProps: {
          bsStyle: 'danger',
          btnText: __('Delete'),
        },
      }}
    >
      {sprintf(__('You are about to delete %s. Are you sure?'), name)}
      <ForemanModal.Footer />
    </ForemanModal>
  );
};

WebhookDeleteModal.propTypes = {
  toDelete: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

WebhookDeleteModal.defaultProps = {
  toDelete: {},
};

export default WebhookDeleteModal;
