import './instance';

// register create function for bundleid
Oskari.bundle('myfeatures', () => Oskari.clazz.create('Oskari.mapframework.bundle.myfeatures.MyFeaturesBundleInstance'));
