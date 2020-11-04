import React from 'react';
import WebhooksIndexPage from './Webhooks/WebhooksIndexPage';

const ForemanWebhooksRoutes = [
  {
    path: '/webhooks',
    exact: true,
    render: props => <WebhooksIndexPage {...props} />,
  },
];

export default ForemanWebhooksRoutes;
