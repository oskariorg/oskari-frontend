/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin';
        me._defaultLocation = 'top left';
        me._index = 1;
        me._name = 'FullScreenPlugin';
        me._fullscreen = null;
    },
    {

        /**
         * @private @method  _createControlElement
         * Binds a click event to the toggle image and adds the div to the DOM.
         */
        _createControlElement: function () {
            // FIXME do this with classes...
            var me = this,
                fsimg = this.getMapModule().getImageUrl() +
                '/framework/bundle/mapmodule-plugin/plugin/fullscreen/images/',
                el = jQuery(
                    '<div class="fullscreenDiv">' +
                    '<img class="fullscreenDivImg" src="' + fsimg + 'hide-navigation.png' + '"></img>' +
                    '</div>'
                );

            el.find('.fullscreenDivImg').bind('click', function (event) {
                event.preventDefault();
                me.getSandbox().postRequestByName(
                    'MapFull.MapWindowFullScreenRequest'
                );

                if (jQuery(this).attr('src').match(/hide-navigation/)) {
                    jQuery(this).attr('src', fsimg + 'show-navigation.png');
                } else {
                    jQuery(this).attr('src', fsimg + 'hide-navigation.png');
                }
            });
            return el;
        }
    },
    {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
