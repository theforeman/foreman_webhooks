import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import actionCellFormatter from '../actionCellFormatter';

jest.mock(
  'foremanReact/components/common/table',
  () => ({
    cellFormatter: content => (
      <div data-testid="cell-formatter-mock">
        {content === false ? null : content}
      </div>
    ),
  }),
  { virtual: true }
);

jest.mock('../../ActionButtons/ActionButton', () => {
  // eslint-disable-next-line global-require
  const PropTypes = require('prop-types');

  const ActionButton = ({ id, name, canDelete }) => (
    <span
      data-testid="action-button"
      data-id={id}
      data-name={name}
      data-can-delete={String(canDelete)}
    />
  );
  ActionButton.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    canDelete: PropTypes.bool,
  };
  ActionButton.defaultProps = {
    canDelete: false,
  };

  return { ActionButton };
});

describe('actionCellFormatter', () => {
  const webhookActions = {
    deleteWebhook: jest.fn(),
    testWebhook: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps the action control in cellFormatter when rowData is present and the row is editable', () => {
    const formatter = actionCellFormatter(webhookActions);
    const row = { id: 10, name: 'Wh', can_edit: true, can_delete: true };

    render(formatter(null, { rowData: row }));

    expect(screen.getByTestId('cell-formatter-mock')).toBeInTheDocument();
    const action = screen.getByTestId('action-button');
    expect(action).toHaveAttribute('data-id', '10');
    expect(action).toHaveAttribute('data-name', 'Wh');
    expect(action).toHaveAttribute('data-can-delete', 'true');
  });

  it('passes canDelete from can_delete when rowData is present', () => {
    const formatter = actionCellFormatter(webhookActions);
    const row = { id: 2, name: 'A', can_edit: true, can_delete: false };

    render(formatter(null, { rowData: row }));

    expect(screen.getByTestId('action-button')).toHaveAttribute(
      'data-can-delete',
      'false'
    );
  });

  it('renders falsy content through cellFormatter when rowData is present but the row is not editable', () => {
    const formatter = actionCellFormatter(webhookActions);
    const row = { id: 5, name: 'B', can_edit: false };

    render(formatter(null, { rowData: row }));

    expect(screen.getByTestId('cell-formatter-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
  });

  it('returns the action control without cellFormatter when rowData is omitted', () => {
    const formatter = actionCellFormatter(webhookActions);
    const row = { id: 20, name: 'Direct', can_edit: true, canDelete: true };

    render(formatter(row));

    expect(screen.queryByTestId('cell-formatter-mock')).not.toBeInTheDocument();
    expect(screen.getByTestId('action-button')).toHaveAttribute(
      'data-id',
      '20'
    );
  });

  it('returns nothing when rowData is omitted and the row is not editable', () => {
    const formatter = actionCellFormatter(webhookActions);
    const row = { id: 1, name: 'X', can_edit: false };

    const { container } = render(formatter(row));

    expect(container).toBeEmptyDOMElement();
  });
});
