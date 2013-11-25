/**
 * @class Oskari.mapframework.bundle.publisher.view.NotLoggedIn
 * Publisher view for users that haven't logged in. Publisher can only be used
 * when logged in because maps are linked to a user. Asks the user to log in
 * and offers links to login/register.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.NotLoggedIn',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
     *     reference to component that created this view
     * @param {Object} localization
     *     localization data in JSON format
     */

    function (instance, localization) {
        this.instance = instance;
        this.template = jQuery("<div class='notLoggedIn'></div>");
        this.loginTemplate = jQuery("<div class='notLoggedIn'><a></a></div>");
        this.registerTemplate = jQuery("<div class='notLoggedIn'><a></a></div>");
        this.loc = localization;
    }, {
        /**
         * @method render
         * Renders the view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be rendered to
         */
        render: function (container) {
            var me = this,
                conf = me.instance.conf,
                sandbox = me.instance.getSandbox(),
                content = me.template.clone(),
                login = me.loginTemplate.clone(),
                loginUrl = null,
                register = me.registerTemplate.clone(),
                registerUrl = null,
                loginTmp = login.find("a"),
                registerTmp = register.find("a");

            if (conf) {
                loginUrl = sandbox.getLocalizedProperty(conf.loginUrl);
                registerUrl = sandbox.getLocalizedProperty(conf.registerUrl);
            }
            content.append(me.loc.text);
            container.append(content);

            if (loginUrl) {
                loginTmp.attr("href", loginUrl);
                loginTmp.append(me.loc.signup);
                container.append(login);
            }

            if (registerUrl) {
                registerTmp.attr("href", registerUrl);
                registerTmp.append(me.loc.register);
                container.append(register);
            }
        }
    });