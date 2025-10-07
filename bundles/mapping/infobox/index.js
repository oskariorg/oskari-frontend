import './instance';
import './resources/scss/infobox.ol.scss';

// register create function for bundleid
Oskari.bundle('infobox', () => Oskari.clazz.create('Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance'));
