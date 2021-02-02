/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a
 * state reset button.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this;
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons';
        this._defaultLocation = 'top right';
        this._index = 20;
        this._name = 'PanButtons';
        this._panPxs = 100;

        me._mobileDefs = {
            buttons: {
                'mobile-reset': {
                    iconCls: 'mobile-reset-map-state',
                    tooltip: '',
                    sticky: false,
                    show: true,
                    callback: function () {
                        me._resetClicked();
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        /**
         * @private @method _createControlElement
         * Draws the panbuttons on the screen.
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            const centerTooltip = Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip');
            var me = this,
                ppid = (new Date()).getTime().toString(),
                el = jQuery(
                    '<div class="mapplugin panbuttonDiv panbuttons">' +
                    '  <div>' +
                    '    <img class="panbuttonDivImg" usemap="#panbuttons_' + ppid + '">' +
                    '      <map name="panbuttons_' + ppid + '">' +
                    '        <area shape="circle"  class="panbuttons_center" title="' + centerTooltip + '" coords="45,45,20" href="#">' +
                    '        <area shape="polygon" class="panbuttons_left"   coords="13,20,25,30,20,45,27,65,13,70,5,45" href="#">' +
                    '        <area shape="polygon" class="panbuttons_up"     coords="30,8,45,4,60,8,60,23,45,20,30,23" href="#">' +
                    '        <area shape="polygon" class="panbuttons_right"  coords="79,20,67,30,72,45,65,65,79,70,87,45" href="#">' +
                    '        <area shape="polygon" class="panbuttons_down"   coords="30,82,45,86,60,82,60,68,45,70,30,68" href="#">' +
                    '      </map>' +
                    '   </img>' +
                    '  </div>' +
                    '</div>'
                ),
                center = el.find('.panbuttons_center'),
                left = el.find('.panbuttons_left'),
                right = el.find('.panbuttons_right'),
                top = el.find('.panbuttons_up'),
                bottom = el.find('.panbuttons_down'),
                panbuttonDivImg = el.find('.panbuttonDivImg');
            // update path from config
            panbuttonDivImg.attr('src', me.getImagePath('empty.png'));

            center.on('mouseover', function (event) {
                panbuttonDivImg.addClass('root');
            });
            center.on('mouseout', function (event) {
                panbuttonDivImg.removeClass('root');
            });
            center.on('click', function (event) {
                me._resetClicked();
            });

            left.on('mouseover', function (event) {
                panbuttonDivImg.addClass('left');
            });
            left.on('mouseout', function (event) {
                panbuttonDivImg.removeClass('left');
            });
            left.on('click', function (event) {
                me._panClicked(-1, 0);
            });

            right.on('mouseover', function (event) {
                panbuttonDivImg.addClass('right');
            });
            right.on('mouseout', function (event) {
                panbuttonDivImg.removeClass('right');
            });
            right.on('click', function (event) {
                me._panClicked(1, 0);
            });

            top.on('mouseover', function (event) {
                panbuttonDivImg.addClass('up');
            });
            top.on('mouseout', function (event) {
                panbuttonDivImg.removeClass('up');
            });
            top.on('click', function () {
                me._panClicked(0, -1);
            });

            bottom.on('mouseover', function (event) {
                panbuttonDivImg.addClass('down');
            });
            bottom.on('mouseout', function (event) {
                panbuttonDivImg.removeClass('down');
            });
            bottom.on('click', function (event) {
                me._panClicked(0, 1);
            });
            el.on('mousedown', function (event) {
                if (!me.inLayerToolsEditMode()) {
                    var radius = Math.round(0.5 * panbuttonDivImg[0].width),
                        pbOffset = panbuttonDivImg.offset(),
                        centerX = pbOffset.left + radius,
                        centerY = pbOffset.top + radius;
                    if (Math.sqrt(Math.pow(centerX - event.pageX, 2) + Math.pow(centerY - event.pageY, 2)) < radius) {
                        event.stopPropagation();
                    }
                }
            });

            return el;
        },
        _resetClicked: function () {
            if (this.inLayerToolsEditMode()) {
                return;
            }
            const popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const cb = () => {
                const requestBuilder = Oskari.requestBuilder(
                    'StateHandler.SetStateRequest'
                );
                if (requestBuilder) {
                    this.getSandbox().request(this, requestBuilder());
                } else {
                    this.getSandbox().resetState();
                }
            };
            popup.show(null, Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.confirmReset'), popup.createConfirmButtons(cb));
            popup.makeModal();
        },
        _panClicked: function (x, y) {
            if (this.inLayerToolsEditMode()) {
                return;
            }
            const pxX = this._panPxs * x;
            const pxY = this._panPxs * y;
            this.getMapModule().panMapByPixels(pxX, pxY, true);
        },
        /**
         * @public  @method _refresh
         * Called after a configuration change.
         *
         *
         */
        refresh: function () {
            var me = this,
                conf = me.getConfig();
            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                // not found -> use the style config obtained from the mapmodule.
                var toolStyle = me.getToolStyleFromMapModule();
                if (toolStyle !== null && toolStyle !== undefined) {
                    me.changeToolStyle(toolStyle, me.getElement());
                }
            }
        },

        /**
         * @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} styleName
         * @param {jQuery} div
         *
         */
        changeToolStyle: function (styleName, div) {
            div = div || this.getElement();
            if (!div) {
                return;
            }
            var panButtons = div.find('img.panbuttonDivImg');
            if (styleName === null) {
                panButtons.removeAttr('style');
            } else {
                var bgImg = this.getImagePath('panbutton-sprites-' + styleName + '.png');

                panButtons.css({
                    'background-image': 'url("' + bgImg + '")'
                });
            }
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            var me = this;
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                me._element = me._createControlElement();
                me.refresh();
                this.addToPluginContainer(me._element);
            }
        },
        teardownUI: function () {
            this.removeFromPluginContainer(this.getElement());
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
