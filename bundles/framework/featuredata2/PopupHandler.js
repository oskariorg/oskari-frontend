/**
 * @class Oskari.mapframework.bundle.featuredata2.PopupHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.PopupHandler",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance} instance
     */

    function (instance) {
        this.instance = instance;
        this.btnContainer = null;

        var me = this,
            sandbox = me.instance.getSandbox(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            p;

        me.selectionPlugin = sandbox.findRegisteredModuleInstance("MainMapModuleMapSelectionPlugin");

        if (!me.selectionPlugin) {
            var config = {
                id: "FeatureData",
                instance: this
            };
            me.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config, sandbox);
            mapModule.registerPlugin(me.selectionPlugin);
            mapModule.startPlugin(me.selectionPlugin);
        }

        this.WFSLayerService = this.instance.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        this.localization = Oskari.getLocalization("FeatureData2");
        this.loc = this.localization.selectionTools;
        this.buttons = {
            'point': {
                iconCls: 'selection-point',
                tooltip: me.loc.tools.point.tooltip,
                sticky: false,
                callback: function (startDrawing) {
                    if (startDrawing) {
                        me.selectionPlugin.startDrawing({
                            drawMode: 'point'
                        });
                    } else {
                        me.selectionPlugin.stopDrawing();
                    }
                }
            },
            'line': {
                iconCls: 'selection-line',
                tooltip: me.loc.tools.line.tooltip,
                sticky: false,
                callback: function (startDrawing) {
                    if (startDrawing) {
                        me.selectionPlugin.startDrawing({
                            drawMode: 'line'
                        });
                    } else {
                        me.selectionPlugin.stopDrawing();
                    }
                }
            },
            'polygon': {
                iconCls: 'selection-area',
                tooltip: me.loc.tools.polygon.tooltip,
                sticky: false,
                callback: function (startDrawing) {
                    if (startDrawing) {
                        me.selectionPlugin.startDrawing({
                            drawMode: 'polygon'
                        });
                    } else {
                        me.selectionPlugin.stopDrawing();
                    }
                }
            },
            'square': {
                iconCls: 'selection-square',
                tooltip: me.loc.tools.square.tooltip,
                sticky: false,
                callback: function (startDrawing) {
                    if (startDrawing) {
                        me.selectionPlugin.startDrawing({
                            drawMode: 'square'
                        });
                    } else {
                        me.selectionPlugin.stopDrawing();
                    }
                }
            },
            'circle': {
                iconCls: 'selection-circle',
                tooltip: me.loc.tools.circle.tooltip,
                sticky: false,
                callback: function (startDrawing) {
                    if (startDrawing) {
                        me.selectionPlugin.startDrawing({
                            drawMode: 'circle'
                        });
                    } else {
                        me.selectionPlugin.stopDrawing();
                    }
                }
            }
        };

        /* templates */
        this.template = {};
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
    }, {

        __templates: {
            "wrapper": '<div class="FeatureDataPopupWrapper"></div>',
            "toolsButton": '<div style= "display: inline-block;"></div>',
            "instructions": '<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>',
            "selectOptions": '<div>' +
                '  <label id="select-from-top-layer" class="selectFeaturesOptions">' +
                '    <input type="radio" name="selectOption" />' +
                '    <span></span>' +
                '  </label>' +
                '  <label id="select-from-all-layers" class="selectFeaturesOptions">' +
                '    <input type="radio" name="selectOption" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            "link": '<div class="link"><a href="javascript:void(0);"></a></div></div>'
        },
        /**
         * @method showSelectionTools
         * Handles tool button click -> opens selection tool dialog
         */
        "showSelectionTools": function () {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                popupLoc = this.loc.title,
                content = me.template.wrapper.clone();

            // Safety check at not show more than one popup
            if(jQuery('.tools_selection').is(':visible')) {
                return;
            }

            //renders selections tools to the content
            me.renderSelectionToolButtons(content);

            var instructions = me.template.instructions.clone();
            instructions.append(this.loc.instructions);
            content.append(instructions);

            var selectOptions = me.template.selectOptions.clone(),
                selectFromTop = jQuery(selectOptions).find('#select-from-top-layer'),
                selectFromAll = jQuery(selectOptions).find('#select-from-all-layers');
            selectFromTop.find('span').html(this.loc.selectFromTop);
            selectFromTop.find('input').attr('checked', true);
            selectFromAll.find('span').html(this.loc.selectAll);

            selectFromTop.bind('click', function () {
                me.WFSLayerService.setSelectFromAllLayers(false);
            });
            selectFromAll.bind('click', function () {
                me.WFSLayerService.setSelectFromAllLayers(true);
            });
            content.append(selectOptions);

            var controlButtons = [];
            var emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            emptyBtn.setTitle(this.loc.button.empty);
            emptyBtn.setHandler(function () {
                // Remove selections
                var sandbox = me.instance.getSandbox();
                var layers = sandbox.findAllSelectedMapLayers();
                for (var i = 0; i < layers.length; ++i) {
                    if (layers[i].hasFeatureData()) {
                        me.WFSLayerService.emptyWFSFeatureSelections(layers[i]);
                    }
                }
                this.blur();
            });
            emptyBtn.blur();
            controlButtons.push(emptyBtn);
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc.button.cancel);
            cancelBtn.setHandler(function () {
                //destroy the active sketch, disable the selected control
                me.selectionPlugin.stopDrawing();
                dialog.close(true);
            });
            cancelBtn.addClass('primary');
            cancelBtn.blur();
            controlButtons.push(cancelBtn);

            dialog.addClass('tools_selection');
            dialog.show(popupLoc, content, controlButtons);
            dialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');

            //tick the select from all layers - checkbox, if it was on previously
            if (me.WFSLayerService.isSelectFromAllLayers()) {
                jQuery('input[type=checkbox][name=selectAll]').prop('checked', true);
            }

        },


        /**
         * @method renderSelectionToolButtons
         * This function renders selection buttons to given content
         *
         * @param {html element} content
         */
        renderSelectionToolButtons: function (content) {
            var me = this,
                activeTool = null,
                startDrawing;

            content.addClass("selectionToolsDiv");

            _.forEach(me.buttons, function (button) {
                var btnContainer = me.template.toolsButton.clone();

                btnContainer.attr("title", button.tooltip);
                btnContainer.addClass(button.iconCls);
                btnContainer.addClass("tool");
                btnContainer.bind('click', function (evt, deselect) {
                    me.removeButtonSelection(content);
                    if( deselect ) {
                        activeTool = null;
                        startDrawing = false;
                        me.selectionPlugin.clearDrawing();
                        return;
                    }
                    if (button === activeTool) {
                        activeTool = null;
                        startDrawing = false;
                        button.callback(startDrawing);
                    } else {
                        activeTool = button;
                        btnContainer.addClass("active");
                        startDrawing = true;
                        button.callback(startDrawing);
                    }
                });
                me.btnContainer = btnContainer;
                content.append(btnContainer);
            });

        },

        /**
         * @method removeButtonSelection
         * Handles active-class of tool buttons
         */
        removeButtonSelection: function (content) {
            if(!content) {
                content = jQuery(".selectionToolsDiv");
            }
            var me = this,
                isActive = jQuery(content).find(".tool").hasClass("active");

            if (isActive) {
                jQuery(content).find(".active").removeClass("active");
                me.WFSLayerService.setSelectionToolsActive(false);
            }
        }
    });