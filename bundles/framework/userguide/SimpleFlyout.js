/**
 * @class Oskari.mapframework.bundle.userguide.Flyout
 *
 * Renders the "help" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.userguide.SimpleFlyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.userguide.UserGuideBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance) {
        var conf = instance.getConfiguration() || {};
        var tags = conf.tags || 'userguide';
        if(conf.includeLang) {
            tags = tags + ',' + Oskari.getLang();
        }
        this.userGuideTabs = [{
            tags : tags
        }];
    }, {

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */

        createUi: function () {
            this.setContent(this.getLocalization('flyout').loadingtxt);
        },

        /**
         * @method getUserGuideTabs
         * Calling method will return userGuideTabs
         */

        getUserGuides: function () {
            return this.userGuideTabs;
        },

        /**
         * @method setContent
         * Sets content to container
         */

        setContent: function (content) {
            if(!this.cel) {
                this.cel = jQuery(this.container);
            }
            this.cel.empty();
            this.cel.append(content);
        }
    },
    {
        /**
         * @property {String[]} protocol
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });