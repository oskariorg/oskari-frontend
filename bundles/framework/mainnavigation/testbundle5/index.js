import { ExplicitCloseTestBundleInstance } from './instance.js';

const BUNDLE_ID = 'explicit-close-testbundle';

Oskari.bundle(BUNDLE_ID, () => new ExplicitCloseTestBundleInstance());