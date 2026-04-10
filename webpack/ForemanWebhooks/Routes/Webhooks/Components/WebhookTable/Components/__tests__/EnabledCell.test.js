import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import EnabledCell from '../EnabledCell';

const fixtures = {
  'should render blank cell': {
    condition: false,
  },
  'should render marked cell': {
    condition: true,
  },
};

describe('EnabledCell', () =>
  testComponentSnapshotsWithFixtures(EnabledCell, fixtures));
