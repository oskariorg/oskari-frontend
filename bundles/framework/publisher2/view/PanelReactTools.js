import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import ReactDOM from 'react-dom';
import { ToolPanelHandler } from '../handler/ToolPanelHandler';
import { PublisherToolsList } from './form/PublisherToolsList';

/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelAdditionalTools
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelReactTools',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (tools, groupId) {
        this.groupId = groupId;
        this.tools = tools || [];
        this.tools = [...this.tools].sort((a, b) => a.index - b.index);
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
            return `Oskari.mapframework.bundle.publisher2.view.PanelReactTools.${this.groupId}`;
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
                this.panel.setTitle(Oskari.getMsg('Publisher2', `BasicView.${this.groupId}.label`));
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
            return [];
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
                    <PublisherToolsList
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
