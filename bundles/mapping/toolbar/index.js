import './instance';
import './resources/css/toolbar.css';

// register create function for bundleid
Oskari.bundle('toolbar', () => Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance'));
