import React from 'react';
import ReactDOM from 'react-dom';
import { RpcPanelHandler } from '../handler/RpcPanelHandler';
import { RpcForm } from './form/RpcForm';
import { LocaleProvider } from 'oskari-ui/util';

/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelRpc
 *
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelRpc',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.insatnce} instance the instance
     */
    function (sandbox, mapModule, localization, instance) {
        this.loc = localization;
        this.instance = instance;
        this.sandbox = sandbox;

        this.templateHelp = jQuery('<div class="help icon-info"></div>');
        this.panel = null;
        this.handler = null;
    }, {
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
         */
        init: function (data) {
            this.handler = new RpcPanelHandler(data, () => this._populatePanel());

            if (!this.panel) {
                this.panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );
                this.panel.setTitle(this.loc.rpc.label);

                this._populatePanel(true);
            }
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
            let data = {
                configuration: {},
                metadata: {}
            };
            const state = this.handler.getState();
            if (state.allowFeedback) {
                data.configuration.feedbackService = {
                    conf: {
                        publish: true
                    },
                    state: {}
                };
                data.metadata.feedbackService = {
                    url: state.feedbackBaseUrl && state.feedbackBaseUrl !== '' ? state.feedbackBaseUrl : null,
                    key: state.feedbackApiKey && state.feedbackApiKey !== '' ? state.feedbackApiKey : null,
                    extensions: state.feedbackExtensions && state.feedbackExtensions !== '' ? state.feedbackExtensions : null
                };
            }
            if (state.allowMetadata) {
                data.configuration.metadatacatalogue = {
                    conf: {
                        noUI: true
                    },
                    state: {}
                };
            }
            return data;
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
         * @method _populateMapLayerPanel
         * @private
         */
        _populatePanel: function (isInit) {
            const contentPanel = this.panel.getContainer();
            contentPanel.empty();

            const content = jQuery('<div />');
            contentPanel.append(content);

            if (isInit) {
                // layer tooltip
                const tooltipCont = this.templateHelp.clone();
                tooltipCont.attr('title', this.loc.rpc.info);
                this.panel.getHeader().append(tooltipCont);
            }

            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
                    <RpcForm
                        state={this.handler.getState()}
                        controller={this.handler.getController()}
                    />
                </LocaleProvider>,
                content[0]
            );
        }
    }
);
