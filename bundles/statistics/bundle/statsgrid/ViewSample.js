/**
 *
 */
Oskari.clazz.category('Oskari.statistics.bundle.statsgrid.View', 'view-content-sample', {

	/**
	 * @method _setupSampleView
	 * sets up the stats PoC view
	 */
	_setupViewContent : function(el) {
		var me = this;
		el.addClass('container-fluid');
        el.css('background-color', 'white');
        el.html('Tähän tulisi taulukko näkymä');
        /*
		var elRow = jQuery('<div style="height:100%;"/>');
		elRow.addClass('row-fluid');
		el.append(elRow);

		var elTbl = jQuery('<div style="height:100%;"/>');
		elTbl.addClass('span6');
		elTbl.addClass("patiopoc-table");
		elRow.append(elTbl);

		var elStats = jQuery('<div style="height:100%;"/>');
		elStats.addClass('span6');
		elRow.append(elStats);

		window.setTimeout(function() {
			me.stats = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.Stats', me);
			me.stats.appendTo(elStats);
			me.createSampleTable(elTbl);
		}, 0);
*/
	}
});
