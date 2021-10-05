import { AbstractVectorLayer } from '../../domain/AbstractVectorLayer';
import { VectorStyle } from '../../domain/VectorStyle';

export class VectorTileLayer extends AbstractVectorLayer {
    constructor () {
        super(...arguments);
        this._layerType = 'VECTORTILE';
    }

    // Clustering isn't supported for VectorTile
    getClusteringDistance () {
        return undefined;
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

    setOptions (options) {
        // super sets normal styles
        super.setOptions(options);
        const { externalStyles = {} } = options;
        // set external styles
        Object.keys(externalStyles).forEach(name => {
            // Use name as title
            const style = new VectorStyle(name, name, 'external', externalStyles[name]);
            this.addStyle(style);
        });
        // Remove externalStyles from options to be sure that VectorStyle is used
        delete options.externalStyles;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.mapmodule.VectorTileLayer', VectorTileLayer);
