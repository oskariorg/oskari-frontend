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
        me._el = null;
        me.state = null;
        me._sandbox = null;
    },
    {
        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol. Should registers requesthandlers and
         * eventlisteners.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin : function(sandbox) {
            var me = this,
                fsimg = this.getMapModule().getImageUrl() +
                '/mapping/mapmodule/resources/images/',
                el = jQuery(
                    '<div class="fullscreenDiv">' +
                    '<img class="fullscreenDivImg" src="' + me._getImagePath('hide-navigation.png') + '"></img>' +
                    '</div>'
                );

            el.find('.fullscreenDivImg').bind('click', function (event) {
                event.preventDefault();

                if (jQuery(this).attr('src').match(/hide-navigation/)) {
                    me._hideNavigation();
                } else {
                    me._showNavigation();
                }
            });
            me._el = el;
            this.getMapModule().getMapEl().append(el);
            me._sandbox = sandbox;

            me._requestHandlers = me._createRequestHandlers();
            Object.keys(me._requestHandlers).forEach(function(key) {
                sandbox.requestHandler(key, me._requestHandlers[key]);
            });

            sandbox.registerAsStateful(me._clazz, me);
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol. Should unregisters requesthandlers and
         * eventlisteners.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin : function(sandbox) {
            var me = this;
            var sandbox = this._sandbox;
            Object.keys(me._requestHandlers).forEach(function(key) {
                sandbox.requestHandler(key, null);
            });
            sandbox.unregisterStateful(me._clazz);
        },

        _getImagePath: function(image) {
            return this.getMapModule().getImageUrl() + '/mapping/mapmodule/resources/images/' + image;
        },

        /**
         * @private @method  _createRequestHandlers
         *
         *
         * @return {Object} Request handler map
         */
        _createRequestHandlers: function () {
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

            if(state.fullscreen) {
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
            if(!me._el) {
                return;
            }
            me._el.find('.fullscreenDivImg').attr('src', me._getImagePath('hide-navigation.png'));
            me.state = {
                fullscreen: false
            };

            me.getMapModule().getMapEl().parents('#contentMap').removeClass('oskari-map-window-fullscreen');
            me._sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');
        },
        _hideNavigation: function(){
            var me = this;
            if(!me._el) {
                return;
            }
            me._el.find('.fullscreenDivImg').attr('src', me._getImagePath('show-navigation.png'));
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
