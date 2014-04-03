Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.ContentPanel',
    function (view) {
        this.view         = view;
        this.instance     = view.instance;
        this.loc          = view.loc;
        this.features     = [];
        this.panel        = this._createPanel();
        this.drawPluginId = this.instance.getName();
        this.drawPlugin   = this._createDrawPlugin();

        this.start();
    }, {
        _templates: {
            'toolContainer': '<div class="toolContainer"></div>',
            'tool': '<div class="tool"></div>'
        },
        getPanel: function() {
            return this.panel;
        },
        getPanelContainer: function() {
            return this.getPanel().getContainer();
        },
        getName: function() {
            return this.instance.getName() + 'ContentPanel';
        },
        onEvent: function(event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        },
        eventHandlers: {

        },
        start: function() {
            var sandbox = this.instance.getSandbox(),
                mapModule = this.instance.getSandbox()
                    .findRegisteredModuleInstance('MainMapModule'),
                p;

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            mapModule.registerPlugin(this.drawPlugin);
            mapModule.startPlugin(this.drawPlugin);
        },
        stop: function() {
            var sandbox = this.instance.getSandbox(),
                mapModule = this.instance.getSandbox()
                    .findRegisteredModuleInstance('MainMapModule'),
                p;

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            mapModule.unregisterPlugin(this.drawPlugin);
            mapModule.stopPlugin(this.drawPlugin);
        },
        /**
         * Creates the content layer selection panel for analyse
         * 
         * @method _createPanel
         * @private
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        _createPanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'),
                panelContainer = panel.getContainer(),
                tooltipCont = this.view.template.help.clone(),
                dataBtn = this._createDataButton();

            panel.setTitle(this.loc.content.label);
            tooltipCont.attr('title', this.loc.content.tooltip);

            panelContainer.append(tooltipCont);
            dataBtn.insertTo(panelContainer);
            panelContainer.append(this._createDrawButtons());

            return panel;
        },
        _createDrawPlugin: function() {
            var drawPlugin = Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', {
                        id: this.drawPluginId,
                        multipart: true
                    });
            
            return drawPlugin;
        },
        _createDataButton: function() {
            var me = this,
                button = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button');

            button.setTitle(this.loc.buttons.data);
            button.addClass('primary');
            button.setHandler(function () {
                me._modifyAnalyseData();
            });

            return button;
        },
        _createDrawButtons: function() {
            var me = this,
                toolContainer = jQuery(this._templates.toolContainer).clone(),
                toolTemplate = jQuery(this._templates.tool),
                tools = ['point', 'line', 'area'];

            return _.foldl(tools, function(container, tool) {
                var toolDiv = toolTemplate.clone();
                toolDiv.addClass('add-' + tool);
                toolDiv.click(function() {
                    me._startNewDrawing({
                        drawMode: tool
                    });
                });
                container.append(toolDiv);

                return container;
            }, toolContainer);
        },
        /**
         * modify analyse data layers in selection box
         * 
         * @method _modifyAnalyseData
         * @private
         */
        _modifyAnalyseData: function () {
            var sandbox = this.instance.getSandbox(),
                extension = this._getFakeExtension('LayerSelector'),
                rn = 'userinterface.UpdateExtensionRequest';

            sandbox.postRequestByName(rn, [extension, 'attach']);
        },
        _getFakeExtension: function (name) {
            return {
                getName: function () {
                    return name;
                }
            };
        },
        /**
         * Resets currently selected place and sends a draw request to plugin
         * with given config.
         * 
         * @method _startNewDrawing
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _startNewDrawing: function (config) {
            var sandbox = this.instance.getSandbox(),
                evtB = sandbox.getEventBuilder(
                    'DrawPlugin.SelectedDrawingEvent'),
                gfiReqBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest');

            // notify components to reset any saved "selected place" data
            if (evtB) sandbox.notifyAll(evtB());

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);

            // disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.instance, gfiReqBuilder(false));
            }
        },
        /**
         * Sends a StartDrawRequest with given params.
         * Changes the panel controls to match the application state (new/edit)
         * 
         * @method _sendDrawRequest
         * @param {Object} config params for StartDrawRequest
         */
        _sendDrawRequest: function (config) {
            var sandbox = this.instance.getSandbox(),
                reqBuilder = sandbox.getRequestBuilder(
                    'DrawPlugin.StartDrawingRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(config);
                sandbox.request(this.instance, request);
            }
        },
});