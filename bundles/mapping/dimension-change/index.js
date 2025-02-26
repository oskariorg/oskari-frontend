import './instance';
import './resources/css/dimension-change.css';

// register create function for bundleid
Oskari.bundle('dimension-change', () => Oskari.clazz.create('Oskari.mapframework.bundle.dimension-change.DimensionChangeBundleInstance'));
