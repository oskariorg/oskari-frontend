/**
 * @to-do: refactor Ext global access
 */

Oskari.clazz
		.define(
				'Oskari.mapframework.enhancement.mapfull.ExtBlankImageEnhancement',
				function() {
				},
				{
					enhance : function(core) {
						core
								.printDebug("Enhancing application by setting EXT BLANK image");
						Ext.BLANK_IMAGE_URL = Oskari.$().startup.imageLocation + '/lib/ext-3.3.1/resources/images/default/s.gif';
					}
				},
				{
					'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
				});

/* Inheritance */
