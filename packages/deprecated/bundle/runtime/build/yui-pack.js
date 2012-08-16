/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * "static" method for finding sandbox.
 */
Oskari.$("mapframework", {} );
Oskari.$().mapframework.runtime = {};

Oskari.$().mapframework.runtime.findSandbox = function() {
	return Oskari.$().mapframework.runtime.components["sandbox"];
};

/**
 * "static" method for finding component with given name.
 * NOTE! you should only use this to find your self.
 * 
 * @param {Object} name
 */
Oskari.$().mapframework.runtime.findComponent = function(name) {
    return Oskari.$().mapframework.runtime.components[name];
};

/**
 * Returns true if component with given name is present
 * 
 * @param {Object} name
 */
Oskari.$().mapframework.runtime.isComponentPresent = function(name) {
	if (Oskari.$().mapframework.runtime.components != null && Oskari.$().mapframework.runtime.components[name] != null) {
		return true;
	} else {
		return false;
	}
};
