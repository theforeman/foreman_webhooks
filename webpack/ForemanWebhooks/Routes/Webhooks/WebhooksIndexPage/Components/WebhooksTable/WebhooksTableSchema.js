import { translate as __ } from 'foremanReact/common/I18n';
import {
  column,
  sortableColumn,
  headerFormatterWithProps,
  deleteActionCellFormatter,
  cellFormatter,
} from 'foremanReact/components/common/table';

import {
  enabledCellFormatter,
  nameToEditFormatter,
} from './Components/Formatters';

const sortControllerFactory = (apiCall, sortBy, sortOrder) => ({
  apply: (by, order) => {
    apiCall({ sort: { by, order } });
  },
  property: sortBy,
  order: sortOrder,
});

const createWebhooksTableSchema = (
  apiCall,
  by,
  order,
  onDeleteClick,
  onEditClick
) => {
  const sortController = sortControllerFactory(apiCall, by, order);

  return [
    sortableColumn('name', __('Name'), 4, sortController, [
      nameToEditFormatter('webhooks', onEditClick),
    ]),
    sortableColumn('targetUrl', __('Target URL'), 4, sortController),
    sortableColumn('enabled', __('Enabled'), 2, sortController, [
      enabledCellFormatter(),
    ]),
    column(
      'actions',
      __('Actions'),
      [headerFormatterWithProps],
      [deleteActionCellFormatter(onDeleteClick), cellFormatter]
    ),
  ];
};

export default createWebhooksTableSchema;
