import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import enabledCellFormatter from '../enabledCellFormatter';

jest.mock('@patternfly/react-icons', () => ({
  CheckIcon: () => <span data-testid="check-icon" />,
  BanIcon: () => <span data-testid="ban-icon" />,
}));

const renderCell = (value, extra) => {
  const formatter = enabledCellFormatter();
  const element = formatter(value, extra);
  return render(element);
};

describe('enabledCellFormatter', () => {
  it('uses the cell value when row context includes rowData and value is true', () => {
    renderCell(true, { rowData: { id: 1, enabled: false } });
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('uses the cell value when row context includes rowData and value is false', () => {
    renderCell(false, { rowData: { id: 1, enabled: true } });
    expect(screen.getByTestId('ban-icon')).toBeInTheDocument();
  });

  it('uses value.enabled when rowData is not present and enabled is true', () => {
    renderCell({ enabled: true });
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('uses value.enabled when rowData is not present and enabled is false', () => {
    renderCell({ enabled: false });
    expect(screen.getByTestId('ban-icon')).toBeInTheDocument();
  });
});
