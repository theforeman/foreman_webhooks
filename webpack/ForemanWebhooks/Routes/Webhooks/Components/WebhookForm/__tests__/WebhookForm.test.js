import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WebhookForm from '../WebhookForm';

const defaultProps = {
  handleSubmit: jest.fn(),
  onCancel: jest.fn(),
  initialValues: {
    http_method: 'POST',
    enabled: true,
    verify_ssl: true,
    http_content_type: 'application/json',
    event: 'host_created.event.foreman',
    name: '',
    target_url: '',
    user: '',
    password: '',
    webhook_template_id: '',
    ssl_ca_certs: '',
    proxy_authorization: false,
    http_headers: '',
  },
  templates: [
    { id: 204, name: 'default template' },
    { id: 205, name: 'default template clone' },
  ],
  availableEvents: [
    { value: 'host_created.event.foreman', label: 'Host Created' },
    { value: 'host_updated.event.foreman', label: 'Host Updated' },
  ],
  isEventsLoading: false,
  isTemplatesLoading: false,
  isPasswordDisabled: false,
  isLoading: false,
  setIsPasswordDisabled: jest.fn(),
};

describe('WebhookForm RTL Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders General tab fields by default', () => {
    render(<WebhookForm {...defaultProps} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Credentials')).toBeInTheDocument();
    expect(screen.getByText('Additional')).toBeInTheDocument();

    expect(screen.getByText('Subscribe to')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Target URL')).toBeInTheDocument();
    expect(screen.getByText('Template')).toBeInTheDocument();
    expect(screen.getByText('HTTP Method')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  describe('Tab Navigation', () => {
    test('switches to Credentials tab when clicked', () => {
      render(<WebhookForm {...defaultProps} />);

      fireEvent.click(screen.getByText('Credentials'));

      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Verify SSL')).toBeInTheDocument();
      expect(screen.getByText('Proxy Authorization')).toBeInTheDocument();
      expect(
        screen.getByText('X509 Certificate Authorities')
      ).toBeInTheDocument();
    });

    test('switches to Additional tab when clicked', () => {
      render(<WebhookForm {...defaultProps} />);

      fireEvent.click(screen.getByText('Additional'));

      expect(screen.getByText('HTTP Content Type')).toBeInTheDocument();
      expect(screen.getByText('HTTP Headers')).toBeInTheDocument();
    });
  });

  describe('Form Field Interactions', () => {
    test('toggles enabled checkbox', () => {
      render(<WebhookForm {...defaultProps} />);

      const enabledCheckbox = document.querySelector('input#id-enabled');
      expect(enabledCheckbox).toBeChecked();

      fireEvent.click(enabledCheckbox);
      expect(enabledCheckbox).not.toBeChecked();
    });

    test('updates user field in Credentials tab', () => {
      render(<WebhookForm {...defaultProps} />);

      fireEvent.click(screen.getByText('Credentials'));

      const userInput = document.querySelector('input#id-user');
      fireEvent.change(userInput, { target: { value: 'testuser' } });

      expect(userInput.value).toBe('testuser');
    });
  });

  describe('Form Submission', () => {
    test('Submit button is disabled should not call handleSubmit', async () => {
      const handleSubmit = jest.fn();
      render(<WebhookForm {...defaultProps} handleSubmit={handleSubmit} />);

      const submitBtn = screen.getByRole('button', { name: 'Submit' });

      expect(submitBtn).toBeDisabled();
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalledTimes(0);
    });

    test('calls handleSubmit with form data when Submit button is clicked', async () => {
      const handleSubmit = jest.fn();
      const initialValues = {
        ...defaultProps.initialValues,
        webhook_template_id: 204,
      };

      render(
        <WebhookForm
          {...defaultProps}
          initialValues={initialValues}
          handleSubmit={handleSubmit}
        />
      );

      const input = document.querySelector('input#id-name');
      expect(input).toBeInTheDocument();
      await userEvent.type(input, 'Test Webhook');
      fireEvent.change(document.querySelector('input#id-target_url'), {
        target: { value: 'https://example.com/webhook' },
      });

      const submitBtn = screen.getByRole('button', { name: 'Submit' });

      expect(submitBtn).not.toBeDisabled();
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Webhook',
          target_url: 'https://example.com/webhook',
        })
      );
    });

    test('calls onCancel when Cancel button is clicked', () => {
      const onCancel = jest.fn();
      render(<WebhookForm {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading States', () => {
    test('disables password field when isPasswordDisabled is true', async () => {
      render(<WebhookForm {...defaultProps} isPasswordDisabled />);

      await fireEvent.click(screen.getByText('Credentials'));

      const passwordInput = document.querySelector('input#id-password');
      expect(passwordInput).toBeDisabled();
    });

    test('password field rendered correctly when isPasswordDisabled is false', async () => {
      render(<WebhookForm {...defaultProps} />);

      await fireEvent.click(screen.getByText('Credentials'));

      const passwordInput = document.querySelector('input#id-password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).not.toBeDisabled();
    });
  });

  describe('Initial Values', () => {
    test('renders with provided initial values', () => {
      const initialValues = {
        ...defaultProps.initialValues,
        name: 'Initial Webhook',
        target_url: 'https://initial.example.com',
        enabled: false,
        verify_ssl: false,
      };

      render(<WebhookForm {...defaultProps} initialValues={initialValues} />);

      expect(document.querySelector('input#id-name')).toHaveValue(
        'Initial Webhook'
      );
      expect(document.querySelector('input#id-target_url')).toHaveValue(
        'https://initial.example.com'
      );
      expect(document.querySelector('input#id-enabled')).not.toBeChecked();

      fireEvent.click(screen.getByText('Credentials'));
      expect(document.querySelector('input#id-verify_ssl')).not.toBeChecked();
    });
  });

  describe('Test submitted data', () => {
    test('submits correct data structure', async () => {
      const handleSubmit = jest.fn();
      render(<WebhookForm {...defaultProps} handleSubmit={handleSubmit} />);

      const nameInput = document.querySelector('input#id-name');
      await userEvent.type(nameInput, 'Webhook Test');
      await fireEvent.change(document.querySelector('input#id-target_url'), {
        target: { value: 'https://example.com/webhook' },
      });

      const webhookTemplateInput = document.querySelector(
        'input#id-webhook_template_id'
      );
      fireEvent.click(webhookTemplateInput);

      await waitFor(() => {
        const option = screen.getByRole('option', { name: 'default template' });
        fireEvent.click(option);
      });

      await fireEvent.click(screen.getByText('Credentials'));

      const userInput = document.querySelector('input#id-user');
      await fireEvent.change(userInput, { target: { value: 'testuser' } });

      const passwordInput = document.querySelector('input#id-password');
      await fireEvent.change(passwordInput, { target: { value: 'testpass' } });

      const submitBtn = screen.getByRole('button', { name: 'Submit' });

      expect(submitBtn).not.toBeDisabled();
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Webhook Test',
        target_url: 'https://example.com/webhook',
        webhook_template_id: 204,
        http_method: 'POST',
        enabled: true,
        verify_ssl: true,
        http_content_type: 'application/json',
        event: 'host_created.event.foreman',
        user: 'testuser',
        password: 'testpass',
        proxy_authorization: false,
        ssl_ca_certs: '',
        http_headers: '',
      });
    });
  });
});
