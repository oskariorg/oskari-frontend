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
    function (instance, localization) {
        this.localization = localization;
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
