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
            var dropdown = null;
            popupService.closeAllPopups(true);

            var legends = me.getLegends();
            if( legends.length === 1 ) {
                singleLegend = true;
            }
            var content = me._popup.getJqueryContent();
            var legendContent = me.generateLegendContainer(singleLegend);

            if( !singleLegend ) {
              dropdown = legendContent.find('.oskari-select');
            }

            var title = singleLegend ? me._loc.singleLegend + legends[0].title : me._loc.title;
            me._popup.adaptToMapSize(me.getSandbox(), 'maplegend');

            me.getLayerLegend( function( img ) {
                content.find('.imgDiv').remove();
                content.find('.legendLink').remove();
                content.find('.error').remove();
                var legendImage = jQuery('<div class="imgDiv"></div>');
                var legendLink = jQuery('<div class="legendLink"><a target="_blank" ></a></br></br></div>');
                legendLink.find('a').attr('href', img.src);
                legendLink.find('a').text(me._loc.newtab);
                legendImage.append(img);
                content.append(legendContent);
                content.append(legendLink);
                content.append(legendImage);
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
                content.find('.error').remove();
                content.append('<div class="error">' + me._loc.invalidLegendUrl + '</div>');
            }, singleLegend, dropdown );

            if( !singleLegend ) {
              dropdown.trigger('change');
            }

            if ( me._isVisible ) {
                me._popup.show( title, null );
                popupCloseIcon = ( Oskari.util.isDarkColor( themeColours.activeColour ) ) ? 'icon-close-white' : undefined;
                me._popup.createCloseIcon();
                me._popup.onClose(function() {
                    me._isVisible = false;
                    me._resetMobileIcon( el, me._mobileDefs.buttons['mobile-maplegend'].iconCls );
                });
                me._popup.setColourScheme({
                    'bgColour': themeColours.activeColour,
                    'titleColour': themeColours.activeTextColour,
                    'iconCls': popupCloseIcon
                });
                me._popup.addClass('maplegend__popup');
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
            me._popup.addClass('maplegend__popup');
            var themeColours = me.getMapModule().getThemeColours();
            var singleLegend = false;
            var dropdown = null;
            popupService.closeAllPopups(true);

            legend.attr('title', me._loc.tooltip);

            var popupLocation = this.getPopupPosition();

            legend.on("click", function() {
                if( me._toggleToolState() === false){
                    return;
                }
                var legends = me.getLegends();
                var title = me._loc.title;
                if(legends.length === 1) {
                    title = me._loc.singleLegend + legends[0].title;
                    singleLegend = true;
                    me._popup.show(title, null);
                } else {
                  me._popup.show(title, null);
                  me._popup.moveTo(legend, popupLocation, true);
                }

                var content = me._popup.getJqueryContent();
                var legendContent = me.generateLegendContainer(singleLegend);
                if( !singleLegend ) {
                  dropdown = legendContent.find('.oskari-select');
                }
                content.append(legendContent);

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
                    me._popup.close();
                });
                me._popup.adaptToMapSize(me.getSandbox(), 'maplegend');
                me._isVisible = true;
                me.getLayerLegend( function( img ) {
                    content.find('.imgDiv').remove();
                    content.find('.legendLink').remove();
                    content.find('.error').remove();
                    var legendImage = jQuery('<div class="imgDiv"></div>');
                    var legendLink = jQuery('<div class="legendLink"><a target="_blank" ></a></br></br></div>');
                    legendLink.find('a').attr('href', img.src);
                    legendLink.find('a').text(me._loc.newtab);
                    legendImage.append(img);
                    content.append(legendLink);
                    content.append(legendImage);
                    me._popup.moveTo(legend, popupLocation, true);
                }, function( ) {
                    me._popup.moveTo(legend, popupLocation, true);
                    content.find('.imgDiv').remove();
                    content.find('.error').remove();
                    content.append('<div class="error">' + me._loc.invalidLegendUrl + '</div>');
                }, singleLegend, dropdown);

                if( !singleLegend ) {
                  dropdown.trigger('change');
                }
            });
            return legend;
        },
        getPopupPosition: function() {
          var popupLocation;

          if (this._config.location && this._config.location.classes === "top left") {
                popupLocation = "right";
            } else {
                popupLocation = "left";
            }
        return popupLocation;
        },
        generateLegendContainer: function( singleLegend ) {
          var me = this;
          var legendContainer = this._templates.legendContainer.clone();
          var legendInfo = this._templates.legendInfo.clone();
          var legendDivider = this._templates.legendDivider.clone();

          legendInfo.text(me._loc.infotext);

          if( !singleLegend ) {
            var dropdown = me.createDropdown();
            legendContainer.append(legendInfo);
            legendContainer.append(legendDivider);
            legendContainer.append(dropdown);
          } else {
            legendContainer.append(legendDivider);
          }
          return legendContainer;

        },
        createDropdown: function() {
          var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');

          var legendLayers = this.getLegends();
          var options = {
              placeholder_text: 'layers',
              allow_single_deselect: false,
              disable_search_threshold: 10,
              width: '100%'
          };
          var dropdown = select.create(legendLayers, options);
          dropdown.css({
              width: '96%',
              paddingBottom: '1em'
          });
          select.adjustChosen();
          select.selectFirstValue();
          return dropdown;
        },
        getLayerLegend: function(successCb, errorCb, singleLegend, dropdown) {

            var layer,
                me = this;

            if( singleLegend ) {
                var legendLayer = me.getLegends();
                layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(legendLayer[0].id);

                if (!layer) {
                    return;
                }
                var legendImg = jQuery('<img id="legendImg"></img>');
                legendImg.attr('src', layer.getLegendImage());

                if(typeof successCb === 'function') {
                    legendImg.on('load', function() {
                        successCb(this);
                    });
                }
                if(typeof errorCb === 'function') {
                    legendImg.on('error', function() {
                        errorCb(this);
                    });
                }

            } else {

                dropdown.on("change", function(e, params) {

                    var id = e.target.value ? e.target.value : jQuery(e.target).find(':selected').val();
                    layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(id);

                    if ( !layer ) {
                        return;
                    }
                    var legendImg = jQuery('<img id="legendImg"></img>');
                    legendImg.attr('src', layer.getLegendImage());
                    legendImg.on('load', function() {
                        // do stuff on success
                        successCb(this);
                    });
                    legendImg.on('error', function() {
                        errorCb(this);
                    });

                });
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
                me._isVisible = false;
                me._popup.close(true);
                return me.isOpen();
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
