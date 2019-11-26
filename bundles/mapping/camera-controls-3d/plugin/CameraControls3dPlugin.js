import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleContext } from 'oskari-ui/util';
import { CameraControls3d } from '../view/CameraControls3d';

const className = 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin';

Oskari.clazz.define(className,
    function (config) {
        this._config = config || {};
        this._clazz = className;
        this._defaultLocation = 'top right';
        this._toolOpen = false;
        this._index = 80;
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'CameraControls3d');
        this._mountPoint = jQuery('<div class="mapplugin camera-controls-3d"><div></div></div>');
    }, {
        getName: function () {
            return className;
        },
        _createUI: function (mapInMobileMode) {
            this._element = this._mountPoint.clone();

            if (mapInMobileMode) {
                //this._element.css({ 'float': 'left' });
                this._element.css('display', 'inline');
                this._addToMobileToolBar();
            } else {
                this._addToPluginContainer();
            }
            ReactDOM.render(
                <LocaleContext.Provider value={this.loc}>
                    <CameraControls3d mapInMobileMode={mapInMobileMode}/>
                </LocaleContext.Provider>, this._element.get(0));
        },
        _addToMobileToolBar () {
            const resetMapState = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
            jQuery(this._element).insertAfter(resetMapState);
        },
        _addToPluginContainer () {
            const panbuttons = jQuery('.mappluginsContent').find('.panbuttons');
            jQuery(this._element).insertAfter(panbuttons);
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this;
            var el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style || 'default');

            var classList = el.attr('class').split(/\s+/);
            for (var c = 0; c < classList.length; c++) {
                var className = classList[c];
                if (className.indexOf('toolstyle-') > -1) {
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode) {
            if (this.getElement()) {
                this.teardownUI();
            }
            this._createUI(mapInMobileMode);
        },
        teardownUI: function () {
            // detach old element from screen
            if (!this.getElement()) {
                return;
            }
            this.getElement().detach();
            this.removeFromPluginContainer(this.getElement());
        },
        hasUi: function () {
            return !this._config.noUI;
        },
        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function () {
            return this._element;
        },
        stopPlugin: function () {
            this.teardownUI();
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
