	/**
	 * @class Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler
	 *
	 * A Temporarily placed handler for showing map measurement (intermediate) results
	 *
	 */
	Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler',

	/**
	 * @method create called automatically on construction
	 * @static
	 * @param {Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance} toolbar
	 *          reference to toolbarInstance that handles the buttons
	 */
	function(toolbar) {
		var me = this;
		me._toolbar = toolbar;

		var loc = this._toolbar.getLocalization('measure');
		var title = loc['title'];
		me._title = title;
		me._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

		var buttons = [];
		var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		cancelBtn.setTitle(loc["close"]);

		buttons.push(cancelBtn);
		me._buttons = buttons;
		me._dialogShown = false;
		me._content = null;
	}, {
		/**
		 * @method handleRequest
		 * shows measurement information
		 * @param {Oskari.mapframework.core.Core} core
		 *      reference to the application core (reference sandbox core.getSandbox())
		 * @param {Oskari.mapframework.request.common.ShowMapMeasurementRequest} request
		 *      request to handle
		 */
		handleRequest : function(core, request) {
			var sandbox = core.getSandbox();

			this._showMeasurementResults(request.getValue());
		},
		getValue : function() {
			return this._value;
		},
		/**
		 * @method _showMeasurementResults
		 */
		_showMeasurementResults : function(value) {
			var me = this;
			var dialog = me._dialog;

			if(!me._dialogShown) {
				dialog.show(me._title, "", me._buttons);
				var cancelBtn = me._buttons[0];
				cancelBtn.setHandler(function() {
					me._dialogShown = false;
					// ask toolbar to select default tool
					var toolbarRequest = me._toolbar.getSandbox().getRequestBuilder('Toolbar.SelectToolButtonRequest')();
					me._toolbar.getSandbox().request(me._toolbar, toolbarRequest);

					me._dialog.close(true);
				});

				dialog.moveTo('#toolbar div.toolrow[tbgroup=basictools]', 'top');
				me._content = jQuery("<div></div>");
				dialog.setContent(me._content);
				me._dialogShown = true;
			}
			/*dialog.addClass('myplaces2');*/

			me._content.html(value);
		},
	}, {
		/**
		 * @property {String[]} protocol array of superclasses as {String}
		 * @static
		 */
		protocol : ['Oskari.mapframework.core.RequestHandler']
	});
