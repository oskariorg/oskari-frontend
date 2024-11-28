import React from 'react';
import ReactDOM from 'react-dom';
import { ToolPanelHandler } from '../handler/ToolPanelHandler';
import { PublisherToolsList } from './form/PublisherToolsList';
import { ThemeProvider, LocaleProvider } from 'oskari-ui/util';

/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelRpc
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelRpc',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.insatnce} instance the instance
     */
    function (tools, sandbox, localization, instance) {
        this.loc = localization;
        this.instance = instance;
        this.sandbox = sandbox;
        this.tools = tools;

        this.templateHelp = jQuery('<div class="help icon-info"></div>');
        this.panel = null;
        this.handler = null;
    }, {
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
         */
        init: function (data) {
            this.handler = new ToolPanelHandler(this.tools, () => this._updateUI());
            return this.handler.init(data);
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelRpc';
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
                this.panel.setTitle(this.loc.rpc.label);
                // layer tooltip
                const tooltipCont = this.templateHelp.clone();
                tooltipCont.attr('title', this.loc.rpc.info);
                this.panel.getHeader().append(tooltipCont);
                this._updateUI();
            }
            return this.panel;
        },
        /**
         * Returns the state of the plugin.
         *
         * @method isEnabled
         * @return {Boolean} true if the plugin is visible on screen.
         */
        isEnabled: function () {
            return this.showLayerSelection;
        },

        /**
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
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
         * Populates the RPC panel in publisher
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
                <ThemeProvider>
                    <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
                        <PublisherToolsList
                            state={this.handler.getState()}
                            controller={this.handler.getController()}
                        />
                    </LocaleProvider>
                </ThemeProvider>,
                contentPanel[0]
            );
        }
    }
);
