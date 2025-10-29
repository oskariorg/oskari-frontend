import { MyFeatureBundleInstance } from './instance';

// register create function for bundleid
Oskari.bundle('myfeatures', () => new MyFeatureBundleInstance());
