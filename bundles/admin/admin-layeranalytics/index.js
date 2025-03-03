import './instance';
import './Tile';
import './Flyout';

// register create function for bundleid
Oskari.bundle('admin-layeranalytics', () => Oskari.clazz.create('Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance'));
