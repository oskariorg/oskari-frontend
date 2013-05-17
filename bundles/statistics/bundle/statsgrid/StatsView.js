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
        if(isShown) {
            this.getLeftColumn().addClass('statsgrid_100');
            this.getLeftColumn().append(this.getEl());
        }
        else {
            this.getLeftColumn().removeClass('statsgrid_100');
            this.getEl().empty();
            this.getEl().remove();
        }
    }
}, {
    "protocol": ["Oskari.userinterface.View"],
    "extend": ["Oskari.statistics.bundle.statsgrid.GridModeView"]
});