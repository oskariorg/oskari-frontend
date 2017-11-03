/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin';
        me._defaultLocation = 'top left';
        me._index = 1;
        me._name = 'FullScreenPlugin';
        me._element = null;
        me.state = {};
        me._sandbox = null;
    },
    {
        /**
         * @method _createControlElement
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function() {
            var me = this;
            el = jQuery(
                '<div class="mapplugin fullscreenDiv">' +
                '<img class="fullscreenDivImg" src="' + me._getImagePath('hide-navigation.png') + '"></img>' +
                '</div>'
            );
            el.find('.fullscreenDivImg').bind('click', function (event) {
                event.preventDefault();
                if (me.state.fullscreen) {
                    me._showNavigation();
                } else {
                    me._hideNavigation();
                }
            });
            return el;
        },
        /**
         * @method _startPluginImpl
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _startPluginImpl : function(sandbox) {
            var me = this;
            me.setEnabled(me._enabled);
            return me.setVisible(me._visible);
        },
        /**
         * @method _stopPluginImpl
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _stopPluginImpl : function(sandbox) {
            this.removeFromPluginContainer(this.getElement());
        },

        _getImagePath: function(image) {
            return this.getMapModule().getImageUrl() + '/mapping/mapmodule/resources/images/' + image;
        },

        /**
         * @private @method  createRequestHandlers
         *
         * @return {Object} Request handler map
         */
        createRequestHandlers: function () {
            return {
                'MapModulePlugin.ToggleFullScreenControlRequest':
                    Oskari.clazz.create(
                        'Oskari.mapframework.bundle.mapmodule.request.ToggleFullScreenControlRequestHandler',
                        this
                    )
            };
        },
        setState: function(state){
            var me = this;
            me.state = state || {};

            if(me.state.fullscreen) {
                me._hideNavigation();
            } else {
                me._showNavigation();
            }
        },
        getState: function() {
            var me = this;
            return me.state;
        },
        _showNavigation: function(){
            var me = this;
            if(!me._element) {
                return;
            }
            me._element.find('.fullscreenDivImg').attr('src', me._getImagePath('hide-navigation.png'));
            me.state = {
                fullscreen: false
            };

            me.getMapModule().getMapEl().parents('#contentMap').removeClass('oskari-map-window-fullscreen');
            me._sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');
        },
        _hideNavigation: function(){
            var me = this;
            if(!me._element) {
                return;
            }
            me._element.find('.fullscreenDivImg').attr('src', me._getImagePath('show-navigation.png'));
            me.state = {
                fullscreen: true
            };
            me.getMapModule().getMapEl().parents('#contentMap').addClass('oskari-map-window-fullscreen');
            me._sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');
        }
    },
    {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
