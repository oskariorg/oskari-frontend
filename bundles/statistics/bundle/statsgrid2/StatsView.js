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
     * @param {Boolean} isShown true if content should be rendered, false if not
     */
    showContent: function(isShown) {
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