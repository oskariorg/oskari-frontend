/**
 * @class Oskari.statistics.bundle.statsgrid.View
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsView',
/**
 * @static constructor function
 */
function() {
}, {
    /**
     * Show content
     * @method showContent
     * @param {boolean} isShown true if content should be rendered, false if not
     * @param {Object} layer which layer should be shown
     * @param {Function} callback function which gets called after the content has finished loading
     */
    showContent: function(isShown, layer, callback) {
        if(this._layer == null || (layer != null && this._layer.getId() != layer.getId())) {
            //update layer
            this._layer = layer;
            this.instance.gridPlugin.setLayer(layer);
            this.instance.state.layerId = this._layer.getId();

            this.isVisible = isShown == true;

            if(isShown) {
                this.toolbar.changeName(this._layer.getName());   
                this._showContent(this.getEl(), callback);
                this.getLeftColumn().addClass('statsgrid_100');
                this.getLeftColumn().append(this.getEl());
            }
            else {
                this.getLeftColumn().removeClass('statsgrid_100');
                this.getEl().remove();
                this.getEl().empty();
            }
        }
    },
    _showContent : function(container, callback) {
        var me = this;
        // var gridContainer = jQuery('<div id="municipalGrid" style="width:30%;height:400px;"></div>');    
		me.instance.gridPlugin.createStatsOut(container, callback);
		// container.append(gridContainer);
        // container.append('Tähän tulisi taulukko näkymä');
    }
}, {
    "protocol": ["Oskari.userinterface.View"],
    "extend": ["Oskari.statistics.bundle.statsgrid.GridModeView"]
});