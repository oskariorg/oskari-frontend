Oskari.clazz
		.define(
				'Oskari.mapframework.ui.module.metadata.OGCServiceManagment',
				function() {

					this._sandbox;
				},
				{
					__name : "OGCServiceManagment",
					getName : function() {
						return this.__name;
					},

					init : function(sandbox) {
						sandbox
								.printDebug("Initializing OGC Service Managment Module...");
						return this.getModulePlaceHolder();
					},

					getModulePlaceHolder : function() {
						var html = '<div id="OGCServiceManagment-placeHolder" style="height: 32px; width: 32px; position: relative !important;z-index: 101 !important;">Testi</div>';

						return html;
					},

					getWizard : function() {

						var html = '';

						return html;
					},

					start : function(sandbox) {
						sandbox.printDebug("Starting " + this.getName());
					},

					onEvent : function(event) {
						if (event.getName() == 'OGCServiceManagmentActionEvent') {
							jQuery("#resultListModule-placeHolder").append(
									this.getResultList(event.getPolygon()));
						}
					}

				},
				{
					'protocol' : ['Oskari.mapframework.module.Module']
				});

/* Inheritance */
