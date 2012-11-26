Oskari.clazz.category(
'Oskari.mapframework.sandbox.Sandbox', 'map-layer-methods',
{
    /*******************************************************************
     * Finds basemap layer by sublayer id.
     *
     * @param {Object}
     *            sublayerid
     */
    findBaselayerBySublayerIdFromAllAvailable : function(sublayerid) {
        var layer = this._core.findBaselayerBySublayerIdFromAllAvailable(sublayerid);
        return layer;
    }
});
