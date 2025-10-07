import './instance';
import './resources/scss/style.scss';

// register create function for bundleid
Oskari.bundle('heatmap', () => Oskari.clazz.create('Oskari.mapframework.bundle.heatmap.HeatmapBundleInstance'));
