Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.view.DrawControls',
    function (instance, loc, stopDrawingFunction, startDrawingFunction) {
        this.instance = instance;
        this.sandbox = this.instance.getSandbox();
        this.loc = loc;
        this.drawStopper = stopDrawingFunction;
        this.drawStarter = startDrawingFunction;
        this.WFSLayerService = this.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        this.selectionPlugin = this.sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');
        this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

        if (!this.selectionPlugin) {
            var config = {
                id: "FeatureData"
            };
            this.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config, this.sandbox);
            this.mapModule.registerPlugin(me.selectionPlugin);
            this.mapModule.startPlugin(me.selectionPlugin);
        }

    }, {
        /**
         * @static @property _templates
         */
        _templates: {
            help: '<div class="help icon-info"></div>',
            buttons: '<div class="buttons"></div>',
            layersContainer: '<div class="layers"></div>',
            toolContainer: '<div class="toolContainer">' +
                '  <h4 class="title"></h4>' +
                '</div>',
            tool: '<div class="tool"></div>',
            drawFilterContainer: '<div class="drawFilterContainer">' +
                '  <h4 class="title"></h4>' +
                '</div>',
            drawFilter: '<div class="drawFilter"></div>',
            selectionToolsContainer: '<div class="toolContainer">'+
                '   <h4 class="title"></h4>'+
                '   <div class="toolContainerToolDiv"></div>'+
                '   <div class="toolContainerFooter"></div>'+
                '   <div class="toolContainerButtons"></div>'+
                '</div>',
            search: '<div class="analyse-search"></div>'
        },

        /**
         * Creates the content layer selection panel for analyse
         *
         * @method createDataPanel
         * @private
         * @param {Object} loc
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        createDataPanel: function (loc) {
            var panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                ),
                panelHeader = panel.getHeader(),
                panelContainer = panel.getContainer(),
                layersCont = jQuery(this._templates.layersContainer).clone(),
                tooltipCont = jQuery(this._templates.help).clone();

            panel.setTitle(loc.content.label);
            tooltipCont.attr('title', loc.content.tooltip);
            tooltipCont.addClass('header-icon-info');

            panelHeader.append(tooltipCont);
            panelContainer.append(layersCont);
            panelContainer.append(this.createDataButtons(loc));

            return panel;
        },

        createDrawToolsPanel: function (loc) {
            var panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                ),
                panelHeader = panel.getHeader(),
                panelContainer = panel.getContainer(),
                tooltipCont = jQuery(this._templates.help).clone();

            panel.setTitle(loc.content.drawToolsLabel);
            tooltipCont.attr('title', loc.content.drawToolsTooltip);
            tooltipCont.addClass('header-icon-info');

            panelHeader.append(tooltipCont);
            panelContainer.append(this.createDrawButtons(loc));

            //don't create buttons since geometryeditor is not yet changed to work with ol4
            //panelContainer.append(this._createDrawFilterButtons(loc));

            panelContainer.append(this.createSelectToolButtons(loc));

            this.drawToolsPanel = panel;

            return panel;
        },

        /**
         * Creates and returns the data button which opens the layer selector
         * and the search button which opens the search flyout.
         *
         * @method createDataButtons
         * @private
         * @param {Object} loc
         * @return {jQuery}
         */
        createDataButtons: function (loc) {
            var me = this,
                buttons = jQuery(this._templates.buttons).clone(),
                dataButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                searchButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );

            dataButton.setId(
                'oskari_analysis_analyse_view_analyse_buttons_data'
            );
            dataButton.setTitle(loc.buttons.data);
            dataButton.addClass('primary');
            dataButton.setHandler(function () {
                me._openFlyoutAs('LayerSelector');
            });
            dataButton.insertTo(buttons);

            searchButton.setId(
                'oskari_analysis_analyse_view_analyse_content_search_title'
            );
            searchButton.setTitle(loc.content.search.title);
            searchButton.addClass('primary');
            searchButton.setHandler(function () {
                me._openFlyoutAs('Search');
            });
            searchButton.insertTo(buttons);

            return buttons;
        },

        /**
         * Sends a request to open a Flyout impersonating
         * as the bundle provided in the name param.
         *
         * @method _openFlyoutAs
         * @private
         * @param  {String} name
         */
        _openFlyoutAs: function (name) {
            var me = this,
                extension = {
                    getName: function () {
                        return name;
                    }
                },
                rn = 'userinterface.UpdateExtensionRequest';

            if(name === 'LayerSelector') {
                var requestName = 'ShowFilteredLayerListRequest';
                me.sandbox.postRequestByName(
                    requestName,
                    [null, 'featuredata']
                );
                clearTimeout(this._flyoutTimeOut);
                this._flyoutTimeOut = setTimeout(function(){
                    me.sandbox.postRequestByName(rn, [extension, 'attach', rn, '0', '424']);
                },100);
            } else {
                me.sandbox.postRequestByName(rn, [extension, 'attach', rn, '0', '424']);
            }
        },

        /**
         * Creates and returns the draw buttons from which the user can draw
         * temporary features which can be used in analysis.
         *
         * @method createDrawButtons
         * @param {Object} loc
         * @return {jQuery}
         */
        createDrawButtons: function (loc) {
            var me = this,
                toolContainer = jQuery(this._templates.toolContainer).clone(),
                toolTemplate = jQuery(this._templates.tool),
                tools = ['point', 'line', 'area'];

            toolContainer.find('h4').html(loc.content.features.title);

            return _.foldl(tools, function (container, tool) {
                var toolDiv = toolTemplate.clone();
                toolDiv.addClass('add-' + tool);
                toolDiv.attr({
                    'title': loc.content.features.tooltips[tool],
                    'id': 'oskari_analysis_analyse_view_analyse_content_features_' + tool
                });
                toolDiv.click(function () {
                    //if selection tool is left active, deactivate it
                    me.deactivateSelectTools();

                    me.drawStarter({
                        drawMode: tool
                    });

                    var controlButtons = me.createDrawControls(),
                        loc = me.loc.content.drawDialog,
                        dialogTitle = loc[tool].title,
                        dialogText = loc[tool].add;

                    me.helpDialog = Oskari.clazz.create(
                        'Oskari.userinterface.component.Popup'
                    );
                    me.helpDialog.show(dialogTitle, dialogText, controlButtons);
                    me.helpDialog.addClass('analyse-draw-dialog');
                    me.helpDialog.moveTo('div.tool.add-' + tool, 'bottom');
                });
                container.append(toolDiv);

                return container;
            }, toolContainer);
        },

        /**
         * Creates and returns the draw filter buttons from which the user can filter
         * by drawing which features are going to be used in analysis.
         *
         * @method _createDrawFilterButtons
         * @private
         * @param {Object} loc
         * @return {jQuery}
         */
        createDrawFilterButtons: function (loc) {
            var me = this,
                drawFilterContainer = jQuery(me._templates.drawFilterContainer).clone(),
                drawFilterTemplate = jQuery(me._templates.drawFilter),
                drawFilters = ['point', 'line', 'edit'];

            drawFilterContainer.find('h4').html(loc.content.drawFilter.title);

            return _.foldl(drawFilters, function (container, drawFilter) {
                var drawFilterDiv = drawFilterTemplate.clone(),
                    groupName = 'analysis-selection-';
                drawFilterDiv.addClass(groupName + drawFilter);

                //disabled by default
                drawFilterDiv.addClass('disabled');
                drawFilterDiv.attr('title', me.loc.content.drawFilter.tooltip[drawFilter]);
                drawFilterDiv.click(function () {
                    //if selection tool is left active, deactivate it
                    me.deactivateSelectTools();

                    if (jQuery(this).hasClass('disabled')) {
                        return;
                    }

                    //notify WFSLayerService that the selection tools ain't on any more.
                    me.WFSLayerService.setSelectionToolsActive(false);


                    me._startNewDrawFiltering({
                        mode: drawFilter,
                        sourceGeometry: me.getSelectedGeometry()
                    });
                });
                container.append(drawFilterDiv);

                return container;
            }, drawFilterContainer);
        },

        /**
         * Creates and returns the selection tool buttons from which the user can select features from wfs map layers
         *
         * @method createSelectToolButtons
         * @param {Object} loc
         * @return {jQuery}
         */
        createSelectToolButtons: function (loc) {
            var me = this,
                selectionToolsContainer = jQuery(me._templates.selectionToolsContainer).clone(),
                selectionToolDiv = jQuery(me._templates.tool).clone(),
                selectionToolButtonsContainer = selectionToolsContainer.find('div.toolContainerButtons'),
                hasWFSLayers = (me.WFSLayerService.getTopWFSLayer() !== undefined && me.WFSLayerService.getTopWFSLayer() !== null),
                WFSSelections = (me.WFSLayerService.getWFSSelections() && me.WFSLayerService.getWFSSelections().length > 0);

            //use the existing component to render selection buttons
            me.selectionButtonsRenderer = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.PopupHandler", me.instance);
            me.selectionButtonsRenderer.renderSelectionToolButtons(selectionToolDiv);

            var emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
            emptyBtn.setHandler(function () {
                if (me.WFSLayerService.getAnalysisWFSLayerId()) {
                    me.WFSLayerService.emptyWFSFeatureSelections(me.sandbox.findMapLayerFromSelectedMapLayers(me.WFSLayerService.getAnalysisWFSLayerId()));
                } else {
                    me.selectControl.unselectAll();
                }
            });
            emptyBtn.setTitle(loc.content.selectionTools.button.empty);
            emptyBtn.insertTo(selectionToolButtonsContainer);

            if (!WFSSelections) {
                emptyBtn.setEnabled(false);
            }

            selectionToolsContainer.find('div.toolContainerToolDiv').append(selectionToolDiv);
            selectionToolsContainer.find('div.toolContainerButtons').append(emptyBtn);
            selectionToolsContainer.find('h4').html(loc.content.selectionTools.title);
            selectionToolsContainer.find('div.toolContainerFooter').html(loc.content.selectionTools.description);


            return selectionToolsContainer;
        },
        /**
         * Deactivates select tools
         *
         * @method deactivateSelectTools
         */
        deactivateSelectTools: function () {
            var me = this,
                toolsPanel = me.drawToolsPanel;

            me.selectionButtonsRenderer.removeButtonSelection();
            me.selectionPlugin.stopDrawing();
        },

        /**
         * @method toggleEmptySelectionBtn
         * Enables / disables the empty selections - button in selection tools
         */
        toggleEmptySelectionBtn: function(enable) {
            var selectionToolsContainer = jQuery('div.toolContainer');
            if (enable) {
                selectionToolsContainer.find(".toolContainerButtons").find("input[type=button]").prop({'disabled': false});
            } else {
                selectionToolsContainer.find(".toolContainerButtons").find("input[type=button]").prop({'disabled': true});
            }
        },

        /**
         * @method createDrawControls
         * Creates and returns the draw control buttons where the user
         * can either save or discard the drawn feature.
         *
         *
         * @return {Oskari.userinterface.component.Button[]}
         */
        createDrawControls: function () {
            var me = this,
                loc = this.loc.content.features.buttons,
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'),
                finishBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );

            cancelBtn.setId(
                'oskari_analysis_analyse_view_analyse_content_features_cancel'
            );
            cancelBtn.setHandler(function () {
                me.drawStopper(true);
                me.closeHelpDialog();
                me.activateWFSLayer(true);
            });

            finishBtn.setTitle(loc.finish);
            finishBtn.setId(
                'oskari_analysis_analyse_view_analyse_content_features_finish'
            );
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me.drawStopper(false);
                me.closeHelpDialog();
                me.activateWFSLayer(true);
            });

            return [cancelBtn, finishBtn];
        },

        closeHelpDialog: function () {
            if (this.helpDialog) {
                this.helpDialog.close(true);
                delete this.helpDialog;
                if (this.mapModule.getDrawingMode()) {
                    this.drawStopper(true);
                }
            }
        },

        activateWFSLayer: function (activate) {
            var sandbox = this.sandbox,
                evtB = Oskari.eventBuilder(
                    'DrawFilterPlugin.SelectedDrawingEvent'
                ),
                gfiReqBuilder = Oskari.requestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest'
                );

            // notify components to reset any saved "selected place" data
            if (evtB) {
                sandbox.notifyAll(evtB());
            }

            // enable or disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.instance, gfiReqBuilder(activate));
            }
        }
    }
);