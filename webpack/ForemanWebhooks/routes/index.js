import React from 'react';
import WebhooksIndexPage from '../components/WebhooksIndexPage';

const ForemanWebhooksRoutes = [
  {
    path: '/ex_webhooks',
    exact: true,
    render: props => <WebhooksIndexPage {...props} />,
  },
];

export default ForemanWebhooksRoutes;
