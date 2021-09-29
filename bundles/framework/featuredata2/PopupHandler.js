/**
 * @class Oskari.mapframework.bundle.featuredata2.PopupHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.PopupHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance} instance
     */

    function (instance) {
        this.instance = instance;
        this.btnContainer = null;
        this.loc = Oskari.getMsg.bind(null, 'FeatureData2');
        var me = this,
            sandbox = me.instance.getSandbox(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            p;

        me.selectionPlugin = sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');

        if (!me.selectionPlugin) {
            var config = {
                id: 'FeatureData',
                instance: this
            };
            me.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config, sandbox);
            mapModule.registerPlugin(me.selectionPlugin);
            mapModule.startPlugin(me.selectionPlugin);
        }

        this.WFSLayerService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        this.buttons = {
            point: {
                iconCls: 'selection-point',
                tooltip: this.loc('selectionTools.tools.point.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('point', start)
            },
            line: {
                iconCls: 'selection-line',
                tooltip: this.loc('selectionTools.tools.line.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('line', start)
            },
            polygon: {
                iconCls: 'selection-area',
                tooltip: this.loc('selectionTools.tools.polygon.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('polygon', start)
            },
            square: {
                iconCls: 'selection-square',
                tooltip: this.loc('selectionTools.tools.square.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('square', start)
            },
            circle: {
                iconCls: 'selection-circle',
                tooltip: this.loc('selectionTools.tools.circle.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('circle', start)
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
            wrapper: '<div class="FeatureDataPopupWrapper"></div>',
            toolsButton: '<div style= "display: inline-block;"></div>',
            instructions: '<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>',
            selectOptions: '<div>' +
                '  <label id="select-from-top-layer" class="selectFeaturesOptions">' +
                '    <input type="radio" name="selectOption" />' +
                '    <span></span>' +
                '  </label>' +
                '  <label id="select-from-all-layers" class="selectFeaturesOptions">' +
                '    <input type="radio" name="selectOption" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            link: '<div class="link"><a href="javascript:void(0);"></a></div></div>'
        },
        selectToolHandler: function (drawMode, startDrawing) {
            if (startDrawing) {
                this.selectionPlugin.startDrawing({ drawMode });
            } else {
                this.selectionPlugin.stopDrawing();
            }
        },
        /**
         * @method showSelectionTools
         * Handles tool button click -> opens selection tool dialog
         */
        showSelectionTools: function () {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const content = this.template.wrapper.clone();

            // TODO this.popup
            // Safety check at not show more than one popup
            if (jQuery('.tools_selection').is(':visible')) {
                return;
            }

            // renders selections tools to the content
            this.renderSelectionToolButtons(content);
            const instructions = this.template.instructions.clone();
            instructions.append(this.loc('selectionTools.instructions'));
            content.append(instructions);

            const selectOptions = this.template.selectOptions.clone();
            const selectFromTop = selectOptions.find('#select-from-top-layer');
            const selectFromAll = selectOptions.find('#select-from-all-layers');

            selectFromTop.find('span').html(this.loc('selectionTools.selectFromTop'));
            selectFromAll.find('span').html(this.loc('selectionTools.selectAll'));
            if (this.selectionPlugin.isSelectFromAllLayers()) {
                selectFromAll.find('input').prop('checked', true);
            } else {
                selectFromTop.find('input').prop('checked', true);
            }
            selectFromTop.on('click', () => this.selectionPlugin.setSelectFromAllLayers(false));
            selectFromAll.on('click', () => this.selectionPlugin.setSelectFromAllLayers(true));
            content.append(selectOptions);

            const controlButtons = [];
            const emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            emptyBtn.setTitle(this.loc('selectionTools.button.empty'));
            emptyBtn.setHandler(() => {
                // Remove selections
                this.instance.removeAllFeatureSelections();
            });
            controlButtons.push(emptyBtn);
            controlButtons.push(dialog.createCloseButton());

            dialog.addClass('tools_selection');
            dialog.show(this.loc('selectionTools.title'), content, controlButtons);
            dialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');
            this.dialog = dialog;
        },

        close: function (selectDefault) { // TODO
            if (!this.dialog) {
                return;
            }
            // destroy the active sketch, disable the selected control
            this.selectionPlugin.stopDrawing();
            this.dialog.close(true);

            if (!selectDefault) {
                return;
            }
            // ask toolbar to select default tool if available
            var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            if (toolbarRequest) {
                Oskari.getSandbox().request(this.instance, toolbarRequest());
            }
        },

        /**
         * @method renderSelectionToolButtons
         * This function renders selection buttons to given content
         *
         * @param {html element} content
         */
        renderSelectionToolButtons: function (content) {
            let activeTool = null;
            let startDrawing;

            content.addClass('selectionToolsDiv');

            Object.keys(this.buttons).forEach(key => {
                const button = this.buttons[key];
                var btnContainer = this.template.toolsButton.clone();

                btnContainer.attr('title', button.tooltip);
                btnContainer.addClass(button.iconCls);
                btnContainer.addClass('tool');
                // TODO cb select/deselect
                btnContainer.on('click', (evt, deselect) => {
                    this.removeButtonSelection(content);
                    if (deselect) {
                        activeTool = null;
                        startDrawing = false;
                        this.selectionPlugin.clearDrawing();
                        return;
                    }
                    if (button === activeTool) {
                        activeTool = null;
                        startDrawing = false;
                        button.callback(startDrawing);
                    } else {
                        activeTool = button;
                        btnContainer.addClass('active');
                        startDrawing = true;
                        button.callback(startDrawing);
                    }
                });
                this.btnContainer = btnContainer;
                content.append(btnContainer);
            });
        },

        /**
         * @method removeButtonSelection
         * Handles active-class of tool buttons
         */
        removeButtonSelection: function (content) {
            if (!content) {
                content = jQuery('.selectionToolsDiv');
            }
            var me = this,
                isActive = jQuery(content).find('.tool').hasClass('active');

            if (isActive) {
                jQuery(content).find('.active').removeClass('active');
            }
        }
    });
