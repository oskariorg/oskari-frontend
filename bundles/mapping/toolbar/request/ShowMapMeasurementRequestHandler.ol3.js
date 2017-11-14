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
        var me = this;
        me._toolbar = toolbar;

        var loc = me._toolbar.getLocalization('measure'),
            title = loc.title;
        me._title = title;
        me._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        me._dialog.addClass('oskari-measurement');

        var buttons = [],
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

        cancelBtn.setTitle(loc.close);

        buttons.push(cancelBtn);
        me._buttons = buttons;
        me._dialogShown = false;
        me._content = null;
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
            var me = this,
                dialog = me._dialog;

            // show measurements in toolbar's content container
            if (me._toolbar.conf.hasContentContainer) {
                me._showResultsInPlugin(value);
            } else {
                // if there is no content container, show the data in dialog
                if (!me._dialogShown) {
                    dialog.show(me._title, '', me._buttons);
                    var cancelBtn = me._buttons[0];
                    cancelBtn.setHandler(function () {
                        if(me._toolbar.currentMeasureTool){
                            me._toolbar.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', [me._toolbar.currentMeasureTool, true]);
                        }
                        me._dialogShown = false;
                        // ask toolbar to select default tool
                        var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')();
                        me._toolbar.getSandbox().request(me._toolbar, toolbarRequest);

                        me._dialog.close(true);
                    });

                    dialog.moveTo('#toolbar div.toolrow[tbgroup=default-basictools]', 'top');
                    me._content = jQuery('<div></div>');
                    dialog.setContent(me._content);
                    me._dialogShown = true;
                }

                me._content.html(value);
            }
        },


        /**
         * @method update
         * implements Module protocol update method
         */
        _showResultsInPlugin: function (value) {
            var me = this,
                toolContainerRequest;
            if (!me.toolContentDivData) {
                var cancelBtn = me._buttons[0];
                cancelBtn.setHandler(function () {
                    if(me._toolbar.currentMeasureTool){
                        me._toolbar.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', [me._toolbar.currentMeasureTool, false]);
                    }
                    // ask toolbar to select default tool
                    var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')();
                    me._toolbar.getSandbox().request(me._toolbar, toolbarRequest);
                    me._hideResultsInPlugin(true);
                });

                // store data for later reuse
                me.toolContentDivData = {
                    className: 'measureline',
                    title: me._title,
                    content: jQuery('<div></div>'),
                    buttons: me._buttons
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
            var me = this,
                toolContainerRequest = Oskari.requestBuilder(
                    'Toolbar.ToolContainerRequest')('reset', me.toolContentDivData);
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
