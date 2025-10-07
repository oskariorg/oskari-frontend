import './instance';
import './resources/scss/drawtools.scss';

// register create function for bundleid
Oskari.bundle('drawtools', () => Oskari.clazz.create('Oskari.mapping.drawtools.DrawToolsBundleInstance'));
