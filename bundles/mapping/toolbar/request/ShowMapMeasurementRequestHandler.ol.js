/**
 * @class Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler
 *
 * A Temporarily placed handler for showing map measurement (intermediate) results
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance} toolbar
     *          reference to toolbarInstance that handles the buttons
     */
    function (toolbar) {
        this._toolbar = toolbar;
        this._loc = toolbar.getLocalization('measure');
        this._dialog = null;
    }, {
        /**
         * @method handleRequest
         * shows measurement information
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.request.common.ShowMapMeasurementRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this._showMeasurementResults(request.getValue());
        },
        getValue: function () {
            return this._value;
        },
        /**
         * @method _showMeasurementResults
         */
        _showMeasurementResults: function (value) {
            // show measurements in toolbar's content container
            if (this._toolbar.conf.hasContentContainer) {
                this._showResultsInPlugin(value);
                return;
            }
            // if there is no content container, show the data in dialog
            if (this._dialog) {
                this._dialog.setContent(value);
                return;
            }

            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.addClass('oskari-measurement');
            const closeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            const clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            closeBtn.setTitle(this._loc.close);
            closeBtn.setHandler(() => this.stopMeasuring(true));
            clearBtn.setTitle(this._loc.clear);
            clearBtn.setHandler(() => this._clearMeasurements());
            dialog.show(this._loc.title, value, [clearBtn, closeBtn]);
            dialog.moveTo('#toolbar div.toolrow[tbgroup=default-basictools]', 'top');
            this._dialog = dialog;
        },
        stopMeasuring: function (selectDefault) {
            var me = this;
            if (this._dialog) {
                this._dialog.close(true);
                this._dialog = null;
            }
            if (this._toolbar.currentMeasureTool) {
                Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', ['mapmeasure', true, true]);
            }
            if (!selectDefault) {
                return;
            }
            // ask toolbar to select default tool
            var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')();
            Oskari.getSandbox().request(me._toolbar, toolbarRequest);
        },
        _clearMeasurements: function () {
            // Clear measurements and continue drawing
            Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', ['mapmeasure', true, true]);
            const tool = this._toolbar.currentMeasureTool;
            if (tool) {
                const shape = tool === 'measureline' ? 'LineString' : 'Polygon';
                Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', ['mapmeasure', shape, {
                    allowMultipleDrawing: true,
                    showMeasureOnMap: true
                }]);
            }
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        _showResultsInPlugin: function (value) {
            var me = this;
            var toolContainerRequest;
            if (!me.toolContentDivData) {
                const cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                cancelBtn.setTitle(this._loc.close);
                cancelBtn.setHandler(function () {
                    me.stopMeasuring(true);
                    me._hideResultsInPlugin(true);
                });

                // store data for later reuse
                me.toolContentDivData = {
                    className: 'measureline',
                    title: this.loc.title,
                    content: jQuery('<div></div>'),
                    buttons: [cancelBtn]
                };

                toolContainerRequest = Oskari.requestBuilder(
                    'Toolbar.ToolContainerRequest')('set', me.toolContentDivData);
                me._toolbar.getSandbox().request(me._toolbar, toolContainerRequest);
            }
            me.toolContentDivData.content.html(value);
        },
        /**
         * @method sendStopDrawRequest
         * Sends a StopDrawingRequest.
         * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _hideResultsInPlugin: function (isCancel) {
            var me = this;
            var toolContainerRequest = Oskari.requestBuilder('Toolbar.ToolContainerRequest')('reset', me.toolContentDivData);
            me._toolbar.getSandbox().request(me._toolbar, toolContainerRequest);
            me.toolContentDivData = null;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
