/**
 * 
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'feature-key-listener-methods',
		{
			handleCtrlKeyDownRequest : function(request) {
				this._ctrlKeyDown = true;
			},
			handleCtrlKeyUpRequest : function(request) {
				this._ctrlKeyDown = false;
			},
			isCtrlKeyDown : function() {
				return this._ctrlKeyDown;
			}
		});
