import './instance.js';
import './resources/scss/style.scss';

// register create function for bundleid
Oskari.bundle('layerlist', () => Oskari.clazz.create('Oskari.mapframework.bundle.layerlist.LayerListBundleInstance'));
