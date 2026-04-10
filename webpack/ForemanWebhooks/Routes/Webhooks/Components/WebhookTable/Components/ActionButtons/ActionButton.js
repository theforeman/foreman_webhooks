import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { ActionButtons } from 'foremanReact/components/common/ActionButtons/ActionButtons';

export const ActionButton = ({ id, name, canDelete, webhookActions }) => {
  const buttons = [];
  if (canDelete) {
    buttons.push({
      title: __('Delete'),
      action: {
        onClick: () => webhookActions.deleteWebhook(id, name),
        id: `webhook-delete-button-${id}`,
      },
    });
  }
  buttons.push({
    title: __('Test webhook'),
    action: {
      onClick: () => webhookActions.testWebhook(id, name),
      id: `webhook-test-button-${id}`,
    },
  });

  return <ActionButtons buttons={buttons} />;
};

ActionButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  canDelete: PropTypes.bool,
  webhookActions: PropTypes.shape({
    deleteWebhook: PropTypes.func,
    testWebhook: PropTypes.func,
  }).isRequired,
};

ActionButton.defaultProps = {
  canDelete: false,
};
