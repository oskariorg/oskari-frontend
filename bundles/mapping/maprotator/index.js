import './instance';
import './resources/scss/maprotator.scss';

// register create function for bundleid
Oskari.bundle('maprotator', () => Oskari.clazz.create('Oskari.mapping.maprotator.MapRotatorBundleInstance'));
