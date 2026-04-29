import React from 'react';
import ConnectedWebhooksIndexPage from './Webhooks/WebhooksIndexPage/WebhooksIndexPage';

const ForemanWebhooksRoutes = [
  {
    path: '/webhooks',
    exact: true,
    render: props => <ConnectedWebhooksIndexPage {...props} />,
  },
];

export default ForemanWebhooksRoutes;
