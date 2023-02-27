
import React from 'react';
import ReactDOM from 'react-dom';
import { PanelToolStyles } from './PanelToolStyles';
/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelToolLayout
 *
 * Represents a tool layout panel (lefthanded / righthanded / custom) for the publisher as an Oskari.userinterface.component.AccordionPanel.
 * Allows the user to change the positioning of the tools on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelLayout',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.instance} instance the instance
     */
    function (sandbox, mapmodule, localization, instance) {
        var me = this;
        me.loc = localization;
        me.instance = instance;
        me.sandbox = sandbox;
        me.mapModule = mapmodule;
        me._originalToolStyle = null;
        me.fonts = [
            {
                name: 'Arial (sans-serif)',
                val: 'arial'
            },
            {
                name: 'Georgia (serif)',
                val: 'georgia'
            },
            {
                name: 'Fantasy (sans-serif)',
                val: 'fantasy'
            },
            {
                name: 'Verdana (sans-serif)',
                val: 'verdana'
            }
        ];
        // The values to be sent to plugins to actually change the style.
    }, {
        /**
         * @method getName
         * @return {String} the name of the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelLayout';
        },
        /**
         * Creates the DOM elements for layout change components and
         * prepopulates the fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data (optional)
         */
        init: function (pData) {
            var me = this;
            me.data = pData || null;

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }

            // Set the initial values
            const theme = this.data?.metadata?.theme;
            me.values = {
                metadata: {
                    theme: theme
                }
            };

            // for restoring after exit
            this._originalTheme = Oskari.app.getTheming().getTheme();
            if (theme) {
                this.updateTheme(theme.map);
            }
            if (!me.panel) {
                me.panel = me._populateLayoutPanel();
            }
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if (!this.panel) {
                this.panel = this._populateLayoutPanel();
            }
            return this.panel;
        },
        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     font : <selected font (string)>,
         *     toolStyle : <selected toolStyle (string)>
         * }
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var me = this;

            // metadata currently saved to two places. The publisher uses the values from metadata to restore a published map's state whereas a published map itself uses
            // the values stored under mapfull's conf.
            me.values = {
                metadata: {
                    theme: Oskari.app.getTheming().getTheme()
                }
            };
            return me.values;
        },
        _populateLayoutPanel: function () {
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var contentPanel = panel.getContainer();

            panel.setTitle(this.loc.layout.label);

            const styleEditor = jQuery('<div />');
            contentPanel.append(styleEditor);

            ReactDOM.render(
                <PanelToolStyles
                    mapTheme={this.mapModule.getMapTheme()}
                    changeTheme={(theme) => this.updateTheme(theme)}
                    fonts={this.fonts}
                />,
                styleEditor[0]
            );

            return panel;
        },
        updateTheme: function (mapTheme) {
            Oskari.app.getTheming().setTheme({
                ...this._originalTheme,
                map: mapTheme
            });
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function () {
            // change the mapmodule theme back to normal
            Oskari.app.getTheming().setTheme(this._originalTheme);
        }
    }
);
