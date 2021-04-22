jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({ toasts: [] }),
}));
jest.mock('foremanReact/history', () => ({
  history: {
    action: 'PUSH',
    listen: jest.fn(),
    location: {
      pathname: '/webhooks',
      search: '',
    },
    push: jest.fn(),
    replace: jest.fn(),
  },
}));
