/**
 * @class Oskari.statistics.bundle.statsgrid.view.MainPanel
 *
 * Creates indicator selector and grid
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.MainPanel',
    /**
     * @static constructor function
     */
    function (instance, localization, sandbox) {
        this.localization = localization;
        this.sandbox = sandbox;
    },
    {
	    render : function(container, instance) {
            var elementWrapper = document.createElement("oskari-statsview"),
              rawUrl = Oskari.getSandbox().getAjaxUrl(),
              // Removing the tailing question mark.
              url = rawUrl.substring(0, rawUrl.length - 1);
            this.container = container;
            container.empty();
            elementWrapper.ajaxUrl = url;
            elementWrapper.locale = this.localization;
            elementWrapper.language = Oskari.getLang();
            elementWrapper.user = this.sandbox.getUser();
            Polymer.dom(container[0]).appendChild(elementWrapper);
	    },
        getContainer : function() {
            return this.container;
        },
        handleSizeChanged : function() {
            // TODO
        }
    }
);
