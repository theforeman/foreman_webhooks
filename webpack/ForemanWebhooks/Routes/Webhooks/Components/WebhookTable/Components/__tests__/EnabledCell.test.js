import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import EnabledCell from '../EnabledCell';

jest.mock('@patternfly/react-icons', () => ({
  CheckIcon: () => <span data-testid="check-icon" />,
  BanIcon: () => <span data-testid="ban-icon" />,
}));

describe('EnabledCell', () => {
  it('renders the check icon when condition is true', () => {
    render(<EnabledCell condition />);

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('ban-icon')).not.toBeInTheDocument();
  });

  it('renders the ban icon when condition is false', () => {
    render(<EnabledCell condition={false} />);

    expect(screen.getByTestId('ban-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });
});
