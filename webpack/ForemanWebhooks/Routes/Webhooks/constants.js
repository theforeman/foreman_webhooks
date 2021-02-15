import { getControllerSearchProps } from 'foremanReact/constants';

export const WEBHOOKS_PAGE_DATA_RESOLVED = 'WEBHOOKS_PAGE_DATA_RESOLVED';
export const WEBHOOKS_PAGE_DATA_FAILED = 'WEBHOOKS_PAGE_DATA_FAILED';
export const WEBHOOKS_PAGE_HIDE_LOADING = 'WEBHOOKS_PAGE_HIDE_LOADING';
export const WEBHOOKS_PAGE_SHOW_LOADING = 'WEBHOOKS_PAGE_SHOW_LOADING';
export const WEBHOOKS_PAGE_CLEAR_ERROR = 'WEBHOOKS_PAGE_CLEAR_ERROR';

export const WEBHOOKS_SEARCH_PROPS = getControllerSearchProps('webhooks');
export const WEBHOOKS_API_PATH = '/api/v2/webhooks?include_permissions=true';
export const WEBHOOKS_PATH = '/webhooks';
export const WEBHOOKS_API_REQUEST_KEY = 'WEBHOOKS';

export const WEBHOOK_TEMPLATES_API_PATH =
  '/api/v2/webhook_templates?include_permissions=true';
export const WEBHOOKS_API_PLAIN_PATH = '/api/v2/webhooks';
export const WEBHOOK_TEMPLATES_API_REQUEST_KEY = 'WEBHOOK_TEMPLATES';
export const WEBHOOK_API_REQUEST_KEY = 'WEBHOOK';
export const WEBHOOK_EVENTS_API_REQUEST_KEY = 'WEBHOOK_EVENTS';

export const WEBHOOK_CREATE_MODAL_ID = 'webhookCreateModal';
export const WEBHOOK_EDIT_MODAL_ID = 'webhookEditModal';
export const WEBHOOK_DELETE_MODAL_ID = 'webhookDeleteModal';
