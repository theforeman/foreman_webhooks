import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import DefaultEmptyState from 'foremanReact/components/common/EmptyState';

const EmptyWebhooksTable = ({ message: { type, text } }) => (
  <DefaultEmptyState
    icon={type === 'error' ? 'error-circle-o' : 'add-circle-o'}
    header={type === 'error' ? __('Error') : __('No Results')}
    description={text}
    documentation={null}
  />
);

EmptyWebhooksTable.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(['empty', 'error']),
    text: PropTypes.string,
  }),
};

EmptyWebhooksTable.defaultProps = {
  message: {
    type: 'empty',
    text: __('Try to create a new webhook'),
  },
};

export default EmptyWebhooksTable;
