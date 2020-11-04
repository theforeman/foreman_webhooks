import { getControllerSearchProps } from 'foremanReact/constants';

export const WEBHOOKS_PAGE_DATA_RESOLVED = 'WEBHOOKS_PAGE_DATA_RESOLVED';
export const WEBHOOKS_PAGE_DATA_FAILED = 'WEBHOOKS_PAGE_DATA_FAILED';
export const WEBHOOKS_PAGE_HIDE_LOADING = 'WEBHOOKS_PAGE_HIDE_LOADING';
export const WEBHOOKS_PAGE_SHOW_LOADING = 'WEBHOOKS_PAGE_SHOW_LOADING';
export const WEBHOOKS_PAGE_CLEAR_ERROR = 'WEBHOOKS_PAGE_CLEAR_ERROR';

export const WEBHOOKS_SEARCH_PROPS = getControllerSearchProps('webhooks');
export const WEBHOOKS_API_PATH = '/api/v2/webhooks?include_permissions=true';
export const WEBHOOKS_PATH = '/webhooks';
export const WEBHOOK_DELETE_MODAL_ID = 'webhookDeleteModal';
export const WEBHOOKS_API_REQUEST_KEY = 'WEBHOOKS';
