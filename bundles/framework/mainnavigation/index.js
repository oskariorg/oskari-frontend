import { MainNavigationBundleIstance } from './instance';

// register create function for bundleid
Oskari.bundle('mainnavigation', () => new MainNavigationBundleIstance());
