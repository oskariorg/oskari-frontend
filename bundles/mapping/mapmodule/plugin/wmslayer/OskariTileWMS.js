import olSourceTileWMS from 'ol/source/TileWMS';

export default class OskariTileWMS extends olSourceTileWMS {
    /**
     * Force tiled WMS to always use the source's projection object instead of the view's, if provided!
     */
    getTile(z, x, y, pixelRatio, projection) {
        return super.getTile(z, x, y, pixelRatio, this.getProjection() || projection);
    }
}