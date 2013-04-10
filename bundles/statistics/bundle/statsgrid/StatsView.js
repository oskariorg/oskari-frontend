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
    showContent: function(isShown) {
        if(isShown) {
            this._showContent(this.getEl());
            this.getLeftColumn().addClass('statsgrid_100');
            this.getLeftColumn().append(this.getEl());
        }
        else {
            this.getLeftColumn().removeClass('statsgrid_100');
            this.getEl().remove();
            this.getEl().empty();
        }
    },
    _showContent : function(container) {
            var me=this;
         // var gridContainer = jQuery('<div id="municipalGrid" style="width:30%;height:400px;"></div>');    
		  me.createStatsOut(container);
		// container.append(gridContainer);
       // container.append('Tähän tulisi taulukko näkymä');
    }
}, {
    "protocol": ["Oskari.userinterface.View"],
    "extend": ["Oskari.statistics.bundle.statsgrid.GridModeView"]
});