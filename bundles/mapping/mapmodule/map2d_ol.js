import './mapmodule.ol';

import './resources/scss/getinfo.scss';
import './resources/scss/logoplugin.scss';
import './resources/scss/datasource.scss';
import './resources/scss/indexmap.ol.scss';
import './resources/scss/scalebar.ol.scss';
import './resources/scss/fullscreen.scss';
import './resources/scss/layersselection.scss';
import './resources/scss/backgroundlayerselection.scss';
import './resources/scss/vectorlayer.scss';
import './resources/scss/mapmodule.ol.scss';
import './resources/scss/attribution.ol.scss';
import './resources/scss/attribution.cs.scss';

// register create function for bundleid
Oskari.bundle('mapmodule', () => {
    return {
        // no-op, this just registers mapmodule to be available for mapfull to use
        start: () => {}
    };
});
