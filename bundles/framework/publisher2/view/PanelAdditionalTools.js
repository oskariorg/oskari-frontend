import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import ReactDOM from 'react-dom';
import { AdditionalTools } from './form/AdditionalTools';
import { AdditionalToolsHandler } from '../handler/AdditionalToolsHandler';

/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelAdditionalTools
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelAdditionalTools',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.instance} instance the instance
     */
    function (tools, sandbox, mapmodule, localization, instance) {
        this.loc = localization;
        this.instance = instance;
        this.sandbox = sandbox;
        this.mapModule = mapmodule;
        this.isDataVisible = false;
        this.tools = tools || [];
        this.tools = [...this.tools].sort((a, b) => a.index - b.index);

        this.config = {
            layers: {
                promote: [{
                    text: this.loc.layerselection.promote,
                    id: [] // 24 , 203
                }],
                preselect: [] // 'base_35'
            }
        };

        this.panel = null;
        this.handler = null;
    }, {
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
        },
        _notifyHandler: function () {
            this.handler?.updateSelectedLayers();
        },
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
         */
        init: function (data) {
            for (const p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.registerForEventByName(this, p);
                }
            }

            this.handler = new AdditionalToolsHandler(this.tools, this.instance.getSandbox(), () => this._updateUI());
            return this.handler.init(data);
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelAdditionalTools';
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if (!this.panel) {
                this.panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );
                this.panel.setTitle(this.loc.additionalTools.label);
                this._updateUI();
            }
            return this.panel;
        },

        /**
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            // just return empty -> tools and their plugins' configs get returned by the layout panel, which has all the tools
            return null;
        },
        /**
         * Returns any errors found in validation (currently doesn't check anything) or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function () {
            var errors = [];
            return errors;
        },

        /**
         * Populates the map layers panel in publisher
         *
         * @method _updateUI
         * @private
         */
        _updateUI: function () {
            if (!this.panel) {
                return;
            }
            const contentPanel = this.panel.getContainer();

            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
                    <AdditionalTools
                        state={this.handler.getState()}
                        controller={this.handler.getController()}
                    />
                </LocaleProvider>,
                contentPanel[0]
            );
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function () {
            this.handler.stop();
        }
    }
);
