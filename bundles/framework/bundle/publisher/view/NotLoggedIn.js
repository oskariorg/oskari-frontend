/**
 * @class Oskari.mapframework.bundle.publisher.view.NotLoggedIn
 * Renders the "publisher" view for users that haven't logged in.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.NotLoggedIn',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
 * 		reference to component that created this view
 * @param {Object} localization
 *      localization data in JSON format
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery("<div class='notLoggedIn'></div>");
	this.signupTemplate = jQuery("<div class='notLoggedIn'><a></a></div>");
	this.registerTemplate = jQuery("<div class='notLoggedIn'><a></a></div>");	

	this.loc = localization;
}, {
    /**
     * @method render
     * @param {jQuery} container reference to DOM element this component will be rendered to
     * Renders component to given DOM element
     */
	render : function(container) {
	    var me = this;
		var content = this.template.clone();
		var signup = this.signupTemplate.clone();
		var register = this.registerTemplate.clone();
		
		content.append(this.loc.text);
		var signupTmp = signup.find("a");
		signupTmp.attr("href", this.loc.signupUrl);
		signupTmp.append(this.loc.signup);
		
		var registerTmp = register.find("a");
		registerTmp.attr("href", this.loc.registerUrl);
		registerTmp.append(this.loc.register);
		
		container.append(content);
		container.append(signup);
		container.append(register);
	}
});
