import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import DefaultEmptyState from 'foremanReact/components/common/EmptyState';

import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import WebhookCreateModal from '../WebhookCreateModal';
import { WEBHOOK_CREATE_MODAL_ID } from '../../../constants';

const EmptyWebhooksIndexPage = ({
  search,
  reloadWithSearch,
  message: { type, text },
}) => {
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
          reloadWithSearch(search);
        }}
        onCancel={setCreateModalClosed}
      />
      <DefaultEmptyState
        icon={type === 'error' ? 'error-circle-o' : 'add-circle-o'}
        header={type === 'error' ? __('Error') : __('No Results')}
        description={text}
        documentation={null}
        action={{
          title: __('Create Webhook'),
          onClick: () => setCreateModalOpen(),
        }}
      />
    </>
  );
};

EmptyWebhooksIndexPage.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(['empty', 'error']),
    text: PropTypes.string,
  }),
  search: PropTypes.string,
  reloadWithSearch: PropTypes.func.isRequired,
};

EmptyWebhooksIndexPage.defaultProps = {
  message: {
    type: 'empty',
    text: __('Try to create a new Webhook'),
  },
  search: '',
};

export default EmptyWebhooksIndexPage;
