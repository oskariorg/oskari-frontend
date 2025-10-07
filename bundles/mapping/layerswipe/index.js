import './instance';
import './resources/css/layerswipe.css';

// register create function for bundleid
Oskari.bundle('layerswipe', () => Oskari.clazz.create('Oskari.mapframework.bundle.layerswipe.LayerSwipeBundleInstance'));
