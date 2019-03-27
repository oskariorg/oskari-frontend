export { AbstractLayer } from './mock/AbstractLayer.class';
export { locale } from './mock/locale';

class MockMap {
    constructor () {
        this.layers = [];
    }
    getSrsName () {
        return 'epsg:3067';
    }
    getLayers () {
        return this.layers;
    }
};
const map = new MockMap();
const sandbox = {
    getMap: () => map
};
export const Oskari = {
    getSandbox: () => sandbox
};
