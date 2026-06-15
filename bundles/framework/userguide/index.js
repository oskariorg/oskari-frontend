import { UserGuideBundleInstance } from './instance';

// register create function for bundleid
Oskari.bundle('userguide', () => new UserGuideBundleInstance());
