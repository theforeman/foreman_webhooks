import { enabledCellFormatter } from '../index';

describe('enabledCellFormatter', () => {
  it('render', () => {
    expect(enabledCellFormatter()(true)).toMatchSnapshot();
  });
});
