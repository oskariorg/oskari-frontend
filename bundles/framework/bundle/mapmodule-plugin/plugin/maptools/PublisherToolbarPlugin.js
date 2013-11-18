/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin
 * Provides map tools container
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePublisherToolbarPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (conf) {
        var me = this;
        me.conf = conf;
        me.element = null;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me._scalebar = null;

        //FIXME conffiin?
        this.toolbarId = 'publishedMap';
//        this.instance = instance;

    }, {

        templates: {
/*            main: jQuery(
                "<div class='mapplugin menuplugin'>" +
                    "<div class='icon'></div>" +
                    "<div class='menucontainer'>" +
                        "<div class='olPopupContent'>" +
                            "<div class='menuTopArrow'></div>" +
                            "<div class='menuContent' >" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            ),
*/
            main: jQuery(
                '<div class="mapplugin tools">'+
                    "<div class='icon'></div>" +
                    "<div class='tools-container'>" +
                        "<div class='olPopupContent'>" +
                            "<div class='tools-top-arrow'></div>" +
                            "<div class='tools-content' >" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                '</div>'),
            container: jQuery("<div></div>")
        },

        /** @static @property __name plugin name */
        __name: 'PublisherToolbarPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
//FIXME localizations to the files!!!!!
            var me = this;
            var pluginLoc = me.getMapModule().getLocalization('plugin', true);
            me.localization = pluginLoc[me.__name];
            me.template = jQuery(me.templates.main);

            me.buttonGroups = [{
                'name' : 'test-tools',
                'buttons': {
                    'testTool' : {
                        toolbarid : me.toolbarId,
                        iconCls : 'selection-square',
                        tooltip : me.localization.test, 
                        sticky : false,
                        toggleSelection : true,
                        callback : function() {
                            alert('test');
                        }
                    }
                }
            }];

        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},

        /**
         * Sets the location of the tools container.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            me.conf.location = location;

            // reset plugin if active
            if (me.element) {
                me.stopPlugin();
                me.startPlugin();
            }
        },

        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the tools container to the map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();

            //register plugin
            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    //register event listeners
                    me._sandbox.registerForEventByName(me, p);
                }
            }

            me._createUI();
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol.
         * Removes the scalebar from map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }
            me.destroy();
            me._sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
            if (me.element) {
                me.element.remove();
                me.element = undefined;
            }
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {},

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

//////////////////////////////////////////////////////////////////////
// toolbar related functions
//////////////////////////////////////////////////////////////////////

        show : function(isShown) {
            var showHide = isShown ? 'show' : 'hide';
            this._sandbox.requestByName(this, 'Toolbar.ToolbarRequest', [this.toolbarId, showHide]);
        },
        destroy : function() {
            this._sandbox.requestByName(this, 'Toolbar.ToolbarRequest', [this.toolbarId, 'remove']);
        },
        changeName: function(title) {
            this._sandbox.requestByName(this, 'Toolbar.ToolbarRequest', [this.toolbarId, 'changeName', title]);
        },

        /**
         * @method _createUI
         * sample toolbar for statistics functionality
         */
        _createUI : function() {
            var me = this,
                sandbox = me._sandbox,
                content,
                containerClasses = 'top left',
                position = 1,
                containers = ((me.conf && me.conf.containers)? me.conf.containers : []);


            // if (this.conf && this.conf.toolStyle) {
            //     content = this.styledTemplate.clone();
            //     this.changeToolStyle(this.conf.toolStyle, content);
            // } else {
            //     content = this.template.clone();
            // }
//            content = this.template.clone();
//            this.element = content;



            if (!me.element) {
                me.element = me.template.clone();
                var wrapper = me.element.find('div.tools-content');
                for (var i = 0, ilen = containers.length; i < ilen; i++) {
                    // create configured containers
                    me.templates.container
                        .clone()
                        .attr("id", containers[i])
                        .appendTo(wrapper)
                }
            }



            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }
            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);

            // if (me.conf && me.conf.font) {
            //     me.changeFont(me.conf.font, content);
            // }


//FIXME localization?
            sandbox.requestByName(me, 'Toolbar.ToolbarRequest', [me.toolbarId, 'add', {
                title : me.localization.title,
                show : false,
                toolbarContainer: me.element.find('.tools-content'),
                closeBoxCallback : function() {
                    view.prepareMode(false);
                }
            }]);



            // hide container
            toolscontainer = me.element.find('.tools-container');
            toolscontainer.hide();

            icon = me.element.find('div.icon');
            icon.on('click', function () {
                toolscontainer.toggle();
            });




        },
        getToolOptions: function() {
            var me = this;
            return me.buttonGroups;
        }



    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
