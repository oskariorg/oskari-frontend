import { AbstractVectorLayer } from '../../domain/AbstractVectorLayer';

export class VectorTileLayer extends AbstractVectorLayer {
    constructor () {
        super(...arguments);
        this._layerType = 'VECTORTILE';
    }

    // Clustering isn't supported for VectorTile
    getClusteringDistance () {
        return undefined;
    }

    hasFeatureData () {
        return false;
    }

    /**
     * @method getTileGrid
     * @return {Object} tile grid configuration
     */
    getTileGrid () {
        return this._options.tileGrid;
    }

    isSupportedSrs (srsName) {
        if (Oskari.getSandbox().getMap().getSupports3D()) {
            return false;
        }
        if (!this._srsList || !this._srsList.length) {
            // if list is not provided, treat as supported
            return true;
        }
        return this._srsList.indexOf(srsName) !== -1;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.mapmodule.VectorTileLayer', VectorTileLayer);
