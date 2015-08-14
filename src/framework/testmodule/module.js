define([
	"oskari",
	"jquery",
	"divmanazer"
], function(Oskari, jQuery, divmanazer) {

	var locale = {
		tile: {
			title: 'TEST MODULE'
		},
		flyout: {
			message: 'Oskari 2.0',
			title: 'TEST MODULE'
		}
	};

	var Flyout = Oskari.ui.Flyout
		.extend({
			startPlugin: function() {
				var el = this.getEl(),
					msg = this.getLocalization().message;
				el.append(msg);
			}
		});

	console.log('Oskari ui Extension extending', Oskari.ui.Extension);
	var Extension = Oskari.ui.Extension
		.extend({
			startPlugin: function() {
				this.setDefaultTile(this.getLocalization('tile').title);
				this.setFlyout(Flyout.create(this, this.getLocalization('flyout')));
			}
		})
		.events({
			'AfterMapMoveEvent' : function(){
				console.log('map moved!');
				this.getFlyout().getEl().append("map moved.");
			}
		});

	var Module = Oskari.Module
		.extend({
			extension: Extension,
			locale: locale,
			identifier: "testModule",
			configuration: {
				sample: 'setting'
			}
		});

	return Module;
});