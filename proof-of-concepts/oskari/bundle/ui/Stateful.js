/**
 * @class Oskari.userinterface.Stateful
 * 
 * A suggestion for state management for Extension.
 * 
 * An extension MAY implement this protocol - or
 * may not if not needed.
 * 
 * 
 * 
 */
Oskari.clazz.define('Oskari.userinterface.Stateful', function() {
}, {
	/**
	 * @method setState 
	 * 
	 * called by state management to set 
	 * a JSON state
	 * 
	 */
	setState : function(state) {
		
	},
	
	/**
	 * @method getState
	 * 
	 * shall return state as JSON
	 */
	getState : function() {
		
	},
	
	/**
	 * @method commitState
	 *
	 * This is called before state is being saved
	 */
	commitState : function() {
	},
	
	/**
	 * @method resumeState
	 *
	 * This is called after state is set 
	 * and Extension is started
	 *
	 */
	resumeState : function() {
	}
});
