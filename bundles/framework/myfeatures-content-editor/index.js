import { MyFeaturesContentEditorBundleInstance } from './instance';

// register create function for bundleid
Oskari.bundle('myfeatures-content-editor', () => new MyFeaturesContentEditorBundleInstance());
