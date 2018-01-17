/**
 * @class Oskari.statistics.statsgrid.plugin.DiagramPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.plugin.DiagramPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        var me = this;
        me._locale = locale || Oskari.getLocalization("StatsGrid");
        me._config = config || {};
        me._mapmodule = mapmodule;
        me._sandbox = sandbox || Oskari.getSandbox();
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.plugin.DiagramPlugin';
        me._defaultLocation = 'bottom right';
        me._index = 9;
        me._name = 'DiagramPlugin';
        me._element = null;
        me._templates = {
            main: jQuery('<div class="mapplugin statsgrid-diagram-plugin"></div>')
        }

        me._createControlElement();

        me.setLocation(me._defaultLocation);

        me._mobileDefs = {
            buttons:  {
                'mobile-diagramtool': {
                    iconCls: 'mobile-statsdiagram',
                    tooltip: me._locale.diagram.title,
                    show: true,
                    callback: function () {
                        if(me._popup && me._popup.isVisible()) {
                            me._popup.close(true);
                        } else {
                            me._showPopup();
                        }
                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        /**
         * Creates UI for classification UI.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var me = this;
            var sb = me._sandbox;
            var locale = me._locale;
            var config = me._config;

            if(me._element !== null) {
                return me._element;
            }
            me._element = me._templates.main.clone();
            return me._element;
        },
        showPublisherDiagram: function () {
            if (  !this.element ) {
                return;
            }
            this.addToPluginContainer(me._element);
        }

    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
