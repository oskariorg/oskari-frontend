/**
 * Runs through all enhancements that can do schedule some events.
 */

Oskari.clazz.category(
//
		'Oskari.mapframework.core.Core', 'enhancement-methods',
		//
		{

			doEnhancements : function(enhancements) {
				for ( var i = 0; i < enhancements.length; i++) {
					enhancements[i].enhance(this);
				}
			}
		});