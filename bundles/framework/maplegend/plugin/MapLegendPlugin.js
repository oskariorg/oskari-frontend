Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
    function(config, plugins) {
        var me = this;
        me._config = config || {};
        me._plugins = plugins;
        me._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin';
        me._defaultLocation = 'top right';
        me._templates = {
            maplegend: jQuery('<div class="mapplugin maplegend"><div class="icon"></div></div>'),
            legendContainer: jQuery('<div class="legendSelector"></div>'),
            legendInfo: jQuery('<div class="legendInfo"></div>'),
            legendDivider: jQuery('<div class="maplegend-divider"></div>')
        };
        me._index = 650;
        me._element = null;
        me._isVisible = false;
        me._loc = null;
        me._popup = null;
        me._mobileDefs = {
            buttons: {
                'mobile-maplegend': {
                    iconCls: 'mobile-maplegend',
                    tooltip: '',
                    show: true,
                    callback: function() {
                        me._toggleToolState();
                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        _createControlElement: function() {
            var me = this,
                loc = Oskari.getLocalization('maplegend', Oskari.getLang());
            var isMobile = Oskari.util.isMobile();

            me._loc = loc;

            if (isMobile) {
                return this.createMobileElement();
            } else {
                return this.createDesktopElement();
            }
        },
        createMobileElement: function() {
            var me = this;
            var el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-maplegend');
            var topOffsetElement = jQuery('div.mobileToolbarDiv');
            var popupCloseIcon = null;
            var themeColours = me.getMapModule().getThemeColours();
            var popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');
            me._popup = popupService.createPopup();
            var singleLegend = false;
            popupService.closeAllPopups(true);

            var legends = me.getLegends();
            if(legends.length === 1) {
                singleLegend = true;
            }
            var title = singleLegend ? me._loc.singleLegend + legends[0].title : me._loc.title;

            me._popup.addClass('maplegend__popup');
            me._popup.addClass('mobile-popup');
            me._popup.setColourScheme({
                "bgColour": "#e6e6e6"
            });
            me._popup.createCloseIcon();

            me._popup.onClose(function() {
                me._isVisible = false;
                me._resetMobileIcon(el, me._mobileDefs.buttons['mobile-maplegend'].iconCls);
            });
            var legendContainer = me.getLayerLegend(function() {
                // move popup if el and topOffsetElement
                if (el && el.length > 0 && topOffsetElement && topOffsetElement.length > 0) {
                    me._popup.moveTo(el, 'bottom', true, topOffsetElement);
                } else {
                    me._popup.moveTo(me.getMapModule().getMapEl(), 'center', true, null);
                }
            }, function() {
                // move popup if el and topOffsetElement
                if (el && el.length > 0 && topOffsetElement && topOffsetElement.length > 0) {
                    me._popup.moveTo(el, 'bottom', true, topOffsetElement);
                } else {
                    me._popup.moveTo(me.getMapModule().getMapEl(), 'center', true, null);
                }
                me._popup.getJqueryContent().find('.accordion').remove();
                me._popup.getJqueryContent().find('.error').remove();
                me._popup.getJqueryContent().append('<div class="error">' + me._loc.invalidLegendUrl + '</div>');
            }, singleLegend);
            legendContainer.find('div.oskari-select').trigger('change');
            if (me._isVisible) {
                me._popup.show(title, legendContainer);

                popupCloseIcon = (Oskari.util.isDarkColor(themeColours.activeColour)) ? 'icon-close-white' : undefined;
                me._popup.setColourScheme({
                    'bgColour': themeColours.activeColour,
                    'titleColour': themeColours.activeTextColour,
                    'iconCls': popupCloseIcon
                });
                me._popup.addClass('mobile-popup');
            }
            return false;
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function(style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style ? style : 'default');

            var classList = el.attr('class').split(/\s+/);
            for (var c = 0; c < classList.length; c++) {
                var className = classList[c];
                if (className.indexOf('toolstyle-') > -1) {
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        },
        createDesktopElement: function() {
            var me = this;
            var legend = me._templates.maplegend.clone();
            var popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');
            me._popup = popupService.createPopup();
            var themeColours = me.getMapModule().getThemeColours();
            var singleLegend = false;
            popupService.closeAllPopups(true);

            legend.on("click", function() {
                if (me.isOpen()) {
                    me._isVisible = false;
                    me._popup.dialog.children().empty();
                    me._popup.close(true);
                    return;
                }
                var legends = me.getLegends();
                if(legends.length === 1) {
                    me._popup.show(me._loc.singleLegend + legends[0].title);
                    singleLegend = true;
                } else {
                    me._popup.show(me._loc.title);
                }
                var content = me._popup.getJqueryContent();
                var parent = content.parents('.divmanazerpopup');
                parent.hide();
                var popupCloseIcon = (me.getMapModule().getTheme() === 'dark') ? 'icon-close-white' : undefined;

                me._popup.createCloseIcon();
                me._popup.setColourScheme({
                    'bgColour': themeColours.backgroundColour,
                    'titleColour': themeColours.textColour,
                    'iconCls': popupCloseIcon
                });

                me._popup.makeDraggable();
                me._popup.onClose(function() {
                    me._popup.dialog.children().empty();
                    me._isVisible = false;
                });
                me._popup.adaptToMapSize(me.getSandbox(), 'maplegend');
                me._isVisible = true;
                var legendContainer = me.getLayerLegend( function() {
                    me._popup.moveTo(legend, 'left', true);
                    parent.show();
                }, function(){
                    me._popup.moveTo(legend, 'left', true);
                    parent.show();
                    me._popup.getJqueryContent().find('.accordion').remove();
                    me._popup.getJqueryContent().empty();
                    me._popup.getJqueryContent().find('.error').remove();
                    me._popup.getJqueryContent().append('<div class="error">' + me._loc.invalidLegendUrl + '</div>');
                }, singleLegend);
                jQuery(me._popup.dialog).append(legendContainer);
                legendContainer.find('div.oskari-select').trigger('change');
            });
            return legend;
        }
        getLayerLegend: function(successCb, errorCb, singleLegend) {

            var layer,
                layerContainer,
                accordionPanel,
                legendContainer = this._templates.legendContainer.clone(),
                legendInfo = this._templates.legendInfo.clone(),
                legendDivider = this._templates.legendDivider.clone(),
                me = this,
                accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');        

            if( singleLegend ) {
                accordion.insertTo(legendContainer);
                    if (accordionPanel) {
                        accordion.removePanel(accordionPanel);
                    }
                    var legendLayer = me.getLegends();
                    layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(legendLayer[0].id);

                    if (!layer) {
                        return;
                    }
                    var legendImg = jQuery('<img></img>');
                    var legendLink = jQuery('<div><a target="_blank" ></a></br></br></div>');
                    legendImg.attr('src', layer.getLegendImage());
                    legendImg.on('load', function() {
                        // do stuff on success
                        successCb();
                    });
                    legendImg.on('error', function() {
                        errorCb();
                    });
                    legendLink.find('a').attr('href', layer.getLegendImage());
                    legendLink.find('a').text(me._loc.newtab);

                    accordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                    accordionPanel.open();
                    accordionPanel.getContainer().append(legendLink);
                    accordionPanel.getContainer().append(legendImg);
                    accordionPanel.getHeader().remove();
                    accordion.addPanel(accordionPanel);
                return legendContainer;
            } else {
            legendInfo.text(me._loc.infotext);
            legendContainer.append(legendInfo);
            legendContainer.append(legendDivider);

            var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');

            var legendLayers = me.getLegends();
            var options = {
                placeholder_text: 'layers',
                allow_single_deselect: false,
                disable_search_threshold: 10,
                width: '100%'
            };
            var dropdown = select.create(legendLayers, options);
            dropdown.css({
                width: '96%'
            });
            select.adjustChosen();
            select.selectFirstValue();
            legendContainer.append(dropdown);

            accordion.insertTo(legendContainer);

            dropdown.on("change", function(e, params) {
                if (accordionPanel) {
                    accordion.removePanel(accordionPanel);
                }
                var id = e.target.value ? e.target.value : jQuery(e.target).find(':selected').val();
                layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(id);

                if (!layer) {
                    return;
                }
                var legendImg = jQuery('<img></img>');
                var legendLink = jQuery('<div><a target="_blank" ></a></br></br></div>');
                legendImg.attr('src', layer.getLegendImage());
                legendImg.on('load', function() {
                    // do stuff on success
                    successCb();
                });
                legendImg.on('error', function() {
                    errorCb();
                });
                legendLink.find('a').attr('href', layer.getLegendImage());
                legendLink.find('a').text(me._loc.newtab);

                accordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                accordionPanel.open();
                accordionPanel.getContainer().append(legendLink);
                accordionPanel.getContainer().append(legendImg);
                accordionPanel.getHeader().remove();
                accordion.addPanel(accordionPanel);

            });
            return legendContainer;
        }
        },
        getLegends: function() {
            var layers = this.getSandbox().findAllSelectedMapLayers().slice(0);
            var legendLayers = [];

            layers.forEach(function(layer) {
                if (!layer.getLegendImage()) {
                    return;
                }
                var layerObject = {
                    id: layer.getId(),
                    title: layer.getName()
                };
                legendLayers.push(layerObject);
            });
            return legendLayers;
        },
        _createUI: function() {
            var me = this,
                conf = me._config;
            this._element = this._createControlElement();
            if (this._element) {
                this.addToPluginContainer(this._element);
            }
            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }
        },
        isOpen: function() {
            return this._isVisible;
        },
        refresh: function() {
            this._popup.dialog.children().empty();
            var legendContainer = this.getLayerLegend();
            jQuery(this._popup.dialog).append(legendContainer);
            legendContainer.find('div.oskari-select').trigger('change');
        },

        redrawUI: function(mapInMobileMode, forced) {
            if (this.getElement()) {
                this.teardownUI(true);
            }
            var me = this;
            var mobileDefs = this.getMobileDefs();
            var sandbox = me.getSandbox();
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            }
            this._createUI();

        },
        teardownUI: function() {
            //detach old element from screen
            this.getElement().detach();
            this.removeFromPluginContainer(this.getElement());
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        /**
         * Toggle tool state.
         * @method @private _toggleToolState
         */
        _toggleToolState: function() {
            var me = this,
                isMobile = Oskari.util.isMobile();

            if (me.isOpen()) {
                me._popup.dialog.children().empty();
                me._isVisible = false;
                me._popup.close(true);
                return;
            } else {
                me._isVisible = true;
                if (isMobile) {
                    me.createMobileElement();
                } else {
                    me.createDesktopElement();
                }
            }
        },
        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function() {
            return this._element;
        },
        stopPlugin: function() {
            this.teardownUI();
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