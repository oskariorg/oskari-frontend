/**
 * @class Oskari.userinterface.bundle.bootstrap.UserInterfaceBundleInstance
 *
 * Alternate DIV Manager implementation handles menu tiles in toolbar like fashion
 * shows detached DIVs. handles hiding showing DIVS.
 * Draggability is enabled in top-border element when DIV is detached
 *
 * This overrides HTML templates with bootstrap 3 compatible ones.
 *
 */
Oskari.clazz.define("Oskari.userinterface.bundle.bootstrap.UserInterfaceBundleInstance",

    /**
     * @method init called on constructing this instance
     */

    function () {

    }, {

        /**
         * HTML templates
         */
        "templates": {

            /* menu tile */
            "Oskari.userinterface.Tile": '<li class="oskari-tile-closed">' + '<a href="#" class="oskari-tile-title"></a>' + '<div class="badge oskari-tile-status"></div>' + '</li>',

            /* flyout */
            "Oskari.userinterface.Flyout": '<div class="panel oskari-flyout oskari-closed">' + '<div class="oskari-flyouttoolbar">' + '<div class="panel-heading oskari-flyoutheading"></div>' + '<div class="panel-title oskari-flyout-title">' + '<p></p>' + '</div>' + '<div class="oskari-flyouttools">' + '<div class="oskari-flyouttool-help">' + '</div>' + '<div class="oskari-flyouttool-attach">' + '</div>' + '<div class="oskari-flyouttool-detach">' + '</div>' + '<div class="oskari-flyouttool-minimize">' + '</div>' + '<div class="oskari-flyouttool-restore">' + '</div>' + '<div class="oskari-flyouttool-close icon-close icon-close:hover">' + '</div>' + '</div>' + '</div>' + '<div class="panel-body oskari-flyoutcontentcontainer">' + '<div class="oskari-flyoutcontent"></div>' + '</div>' + '</div>',

            /* view */
            "Oskari.userinterface.View": '<div class="oskari-view"></div>'

        },


        /**
         * @static @property flyout default positioning
         */
        "defaults": {
            "detach": {
                "left": "212px",
                "top": "200px"
            },
            "attach": {
                "left": "192px",
                "top": "200px"
            }
        }
    }, {
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Stateful'],
        "extend": ["Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance"]

    });