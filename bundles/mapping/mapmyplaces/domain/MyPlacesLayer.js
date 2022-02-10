import { getValueFromLocale } from '../../mapmodule/util/UserDataHelper';

/**
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer
 *
 * MapLayer of type MyPlaces
 */
const WFSLayer = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');

export class MyPlacesLayer extends WFSLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'MYPLACES';
        this._metaType = 'MYPLACES';
        this._locale = {};
    }
    /* Layer type specific functions */

    // override to get name from locale
    getName (lang) {
        return getValueFromLocale(this.getLocale(), 'name', lang);
    }

    getLocale () {
        return this._locale;
    }

    setLocale (locale) {
        this._locale = locale;
    }

    isFilterSupported () {
        // this defaults to false in AbstractLayer, but WFSLayer returns true.
        // Not sure if this is something we want, but it's the same behavior as before but NOT having
        // WFS and analysis referenced in AbstractLayer
        return false;
    }
}
Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer', MyPlacesLayer);
