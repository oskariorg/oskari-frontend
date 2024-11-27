import React from 'react';
import ReactDOM from 'react-dom';
import { ThematicControls } from './ThematicControls';

Oskari.clazz.define('Oskari.statistics.statsgrid.TogglePlugin', function (handler) {
    this._clazz = 'Oskari.statistics.statsgrid.TogglePlugin';
    this._index = 4;
    this._defaultLocation = 'bottom right';
    this._name = 'statsgrid.TogglePlugin';
    this.handler = handler;
}, {
    refresh: function (state = this.handler.getState()) {
        let el = this.getElement();
        if (!el) {
            el = this._createControlElement();
            this.addToPluginContainer(el);
        }
        const { toggle } = this.handler.getController();
        ReactDOM.render(
            <ThematicControls
                mapButtons={state.mapButtons}
                active={state.activeMapButtons}
                toggle={toggle}
            />,
            el[0]
        );
    },
    /**
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     * @private @method _createControlElement
     *
     * @return {jQuery}
     */
    _createControlElement: function () {
        if (!this._element) {
            this._element = jQuery('<div class="statsgrid-published-toggle-buttons mapplugin" />');
        }
        return this._element;
    },

    teardownUI: function (stopping) {
        // detach old element from screen
        this.removeFromPluginContainer(this._element, !stopping);
        if (stopping) {
            this.element = null;
        }
    },
    stopPlugin: function () {
        this.teardownUI(true);
    }
}, {
    extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
    /**
     * @static @property {string[]} protocol array of superclasses
     */
    protocol: [
        'Oskari.mapframework.module.Module',
        'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
    ]
});
