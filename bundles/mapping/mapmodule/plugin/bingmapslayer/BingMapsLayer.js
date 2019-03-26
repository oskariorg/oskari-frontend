const AbstractMapLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

class BingMapsLayer extends AbstractMapLayer {
    constructor () {
        super();
        this._layerType = 'BINGMAPS';
    }
    getApiKey () {
        if (this._options && this._options.apiKey) {
            return this._options.apiKey;
        }
        return 'Get your Bing Maps Key from http://www.bingmapsportal.com/';
    }
}
Oskari.clazz.defineES('Oskari.mapframework.mapmodule.BingMapsLayer', BingMapsLayer, {});
