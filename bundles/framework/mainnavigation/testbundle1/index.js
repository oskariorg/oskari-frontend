import { TestBundle1Instance } from './instance';

const BUNDLE_ID = 'testbundle1';

Oskari.bundle(BUNDLE_ID, () => new TestBundle1Instance());