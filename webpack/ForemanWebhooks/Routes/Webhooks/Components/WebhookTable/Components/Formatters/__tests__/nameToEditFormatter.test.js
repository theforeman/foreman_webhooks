import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import nameToEditFormatter from '../nameToEditFormatter';

jest.mock('@patternfly/react-core', () => {
  // eslint-disable-next-line global-require
  const PropTypes = require('prop-types');

  const Button = ({ children, onClick, isDisabled }) => (
    <button type="button" onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
  Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
  };
  Button.defaultProps = {
    children: null,
    onClick: () => {},
    isDisabled: false,
  };

  return { Button };
});

describe('nameToEditFormatter', () => {
  it('renders the cell value as the label and calls the handler with the row id when can_edit is true', () => {
    const onEdit = jest.fn();
    const formatter = nameToEditFormatter(onEdit);
    const row = { id: 42, name: 'Other', can_edit: true };

    render(formatter('Shown name', { rowData: row }));

    expect(screen.getByText('Shown name')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Shown name'));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(42);
  });

  it('prefers canEdit over can_edit when both are set', () => {
    const onEdit = jest.fn();
    const formatter = nameToEditFormatter(onEdit);

    render(
      formatter('Label', {
        rowData: { id: 1, name: 'N', canEdit: true, can_edit: false },
      })
    );

    fireEvent.click(screen.getByText('Label'));
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('does not call the handler when the row cannot be edited', () => {
    const onEdit = jest.fn();
    const formatter = nameToEditFormatter(onEdit);

    render(
      formatter('Read only', {
        rowData: { id: 7, name: 'X', can_edit: false },
      })
    );

    const control = screen.getByText('Read only');
    expect(control.closest('button')).toBeDisabled();
    fireEvent.click(control);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('uses row.name as the label when rowData is not passed and value is the row object', () => {
    const formatter = nameToEditFormatter(jest.fn());
    const row = { id: 3, name: 'From row', can_edit: false };

    render(formatter(row));

    expect(screen.getByText('From row')).toBeInTheDocument();
  });
});
