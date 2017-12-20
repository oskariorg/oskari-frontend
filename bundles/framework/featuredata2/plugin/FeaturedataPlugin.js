/**
 * @class Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin
 * Provides WFS grid link on top of map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (config) {
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin';
        me._defaultLocation = 'top right';
        me._instance = config.instance;
        me._index = 90;
        me._name = 'FeaturedataPlugin';
        me._mapStatusChanged = true;
        me._flyoutOpen = undefined;

        me._mobileDefs = {
            buttons:  {
                'mobile-featuredata': {
                    iconCls: 'mobile-info-marker',
                    tooltip: '',
                    sticky: true,
                    toggleChangeIcon: true,
                    show: true,
                    callback: function () {
                        if (me._flyoutOpen) {
                            var sandbox = me.getSandbox();
                            sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'close']);

                            var toolbarRequest = sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')(null, 'mobileToolbar-mobile-toolbar');
                            sandbox.request(me, toolbarRequest);

                            me._flyoutOpen = undefined;
                            var flyout = me._instance.plugins['Oskari.userinterface.Flyout'];
                            jQuery(flyout.container.parentElement.parentElement).removeClass('mobile');
                        } else {
                            //kill open popups
                            me.getSandbox().getService('Oskari.userinterface.component.PopupService').closeAllPopups(false);

                            me._openFeatureDataFlyout();
                            me._flyoutOpen = true;
                        }
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        /**
         * @method _createControlElement
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                sandbox = me.getSandbox(),
                el = jQuery('<div class="mapplugin featuredataplugin">' +
                    '<a href="JavaScript: void(0);"></a>' +
                    '</div>');

            var link = el.find('a');
            me._loc = Oskari.getLocalization('FeatureData2', Oskari.getLang() || Oskari.getDefaultLanguage(), true);
            link.html(me._loc.title);
            me._bindLinkClick(el);
            el.mousedown(function (event) {
                event.stopPropagation();
            });

            return el;
        },
        /**
         * @method _hasFeaturedataLayers
         * @private
         * Check whether there are layers with featuredata present -> determine the control element's visibility
         */
        _hasFeaturedataLayers: function() {
            var me = this,
                sandbox = me.getMapModule().getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                i;
            // see if there's any wfs layers, show element if so
            for (i = 0; i < layers.length; i++) {
                if (layers[i].hasFeatureData()) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if(!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                me._element = me._createControlElement();
                this.addToPluginContainer(me._element);
                this.refresh();
            }
        },

        teardownUI : function() {
            //remove old element
            this.removeFromPluginContainer(this.getElement());
            this._instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'close']);
        },

        /**
         * @method  @public mapStatusChanged map status changed
         * @param  {Boolean} changed is map status changed
         */
        mapStatusChanged: function(changed){
            var me = this,
                statusChanged = changed;
            me._mapStatusChanged = statusChanged;
        },

        getMapStatusChanged: function() {
            var me = this;
            return me._mapStatusChanged;
        },

        _bindLinkClick: function (link) {
            var me = this,
                element = me.getElement(),
                linkElement = link || (element ? element.find('a') : null),
                sandbox = me.getSandbox();

            if(!linkElement) {
                return;
            }

            linkElement.bind('click', function () {
                if(!me._flyoutOpen) {
                    if(me._mapStatusChanged) {
                        sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._instance, 'detach']);
                        var event = sandbox.getEventBuilder('WFSRefreshManualLoadLayersEvent')();
                        sandbox.notifyAll(event);
                        me._mapStatusChanged = false;
                    } else {
                        sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._instance, 'detach']);
                    }
                    me._flyoutOpen = true;
                } else {
                    sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'close']);
                    me._flyoutOpen = undefined;
                }
                return false;
            });
        },

        handleCloseFlyout: function () {
            var me = this,
                sandbox = me.getSandbox(),
                el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-featuredata');

            if (!me._flyoutOpen) {
                return;
            }
            me._flyoutOpen = undefined;
            var flyout = me._instance.plugins['Oskari.userinterface.Flyout'];
            jQuery(flyout.container.parentElement.parentElement).removeClass('mobile');
            me._resetMobileIcon(el, me._mobileDefs.buttons['mobile-featuredata'].iconCls);
        },
        /**
         * @method refresh
         * Updates the plugins interface (hides if no featuredata layer selected)
         */
        refresh: function () {
            var me = this,
                isVisible = me._hasFeaturedataLayers(),
                conf = me._config;

            me.setVisible(isVisible);

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }

        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style ? style : 'default');

            var classList = el.attr('class').split(/\s+/);
            for(var c=0;c<classList.length;c++){
                var className = classList[c];
                if(className.indexOf('toolstyle-') > -1){
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        },
        showLoadingIndicator : function(blnLoad) {
            if(!this.getElement()) {
                return;
            }
            if(blnLoad) {
                this.getElement().addClass('loading');
            }
            else {
                this.getElement().removeClass('loading');
            }
        },
        showErrorIndicator : function(blnLoad) {
            if(!this.getElement()) {
                return;
            }
            if(blnLoad) {
                this.getElement().addClass('error');
            }
            else {
                this.getElement().removeClass('error');
            }
        },

        _setLayerToolsEditModeImpl: function () {
            if (!this.inLayerToolsEditMode()) {
                this._bindLinkClick();
            } else {
                this.getElement().find('a').unbind('click');
            }
        },

        _createEventHandlers: function () {
            return {
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                'AfterMapMoveEvent': function (event) {
                    this.refresh();
                }
            };
        },

        _openFeatureDataFlyout: function () {
            this._instance.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'detach']);
            //set style to mobile flyout
            var flyout = this._instance.plugins['Oskari.userinterface.Flyout'];
            jQuery(flyout.container.parentElement.parentElement).addClass('mobile');
            var mapModule = this._instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
                mobileDiv = mapModule.getMobileDiv(),
                top = jQuery(mobileDiv).offset().top,
                height = jQuery(mobileDiv).outerHeight(true),
                flyoutTop = parseInt(top)+parseInt(height);

            flyout.container.parentElement.parentElement.style.top = flyoutTop + 'px';
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
