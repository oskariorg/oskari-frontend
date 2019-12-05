import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleContext } from 'oskari-ui/util';
import { ShadowControl } from '../view/ShadowControl/';
import { ShadowTool } from '../view/ShadowTool/';

// Oskari.clazz.define('Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin',
//     function (mapmodule, sandbox) {
//         this._defaultLocation = 'top right';
//         this._time = null;
//         this._date = null;
//         this._mapmodule = mapmodule;
//         this._sandbox = sandbox;
//         this._log = Oskari.log('Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin');
//         this.loc = Oskari.getMsg.bind(null, 'ShadowingPlugin3d');
//         this._toolOpen = false;
//         this._element = null;
//         this._popupContent = null;
//         this._popup = null;
//         this._mountPoint = jQuery('<div class="mapplugin shadow-plugin"><div></div></div>');
//         this._popupTemplate = jQuery('<div></div>');
//     }, {
//         _clazz: 'Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin',
//         __name: 'ShadowingPlugin',
//         init: function () {
//             this.sandbox.registerForEventByName(this, 'AfterMapMoveEvent');
//         },

//         _createEventHandlers: function () {
//             return {
//                 TimeChangedEvent: function (event) {
//                     this._time = event.getTime();
//                     this._date = event.getDate();
//                 }
//             };
//         },

//         onEvent: function (event) {
//             console.log(event);
//         },

//         getElement: function () {
//             return this._element;
//         },

//         getMapModule: function () {
//             return this._mapmodule;
//         },

//         getSandBox: function () {
//             return this._sandbox;
//         },

//         _teardownUI: function () {
//             if (!this.getElement()) {
//                 return;
//             }
//             ReactDOM.unmountComponentAtNode(this.getElement().get(0));
//             this.getElement().detach();
//         },

//         stopPlugin: function () {
//             this._teardownUI();
//         },

//         _createUI: function (mapInMobileMode) {
//             this._element = this._mountPoint.clone();

//             if (mapInMobileMode) {
//                 this._element.css('display', 'inline-block');
//                 this._addToMobileToolBar();
//             } else {
//                 this._addToPluginContainer();
//             }

//             this._createControlElement();

//             ReactDOM.render(
//                 <LocaleContext.Provider value={this.loc}>
//                     <ShadowControl mapInMobileMode={mapInMobileMode}/>
//                 </LocaleContext.Provider>, this._element.get(0));
//         },

//         _createControlElement: function () {
//             const me = this;
//             const el = this.getElement();

//             el.off('click');
//             el.on('click', function (event) {
//                 me._toggleToolState();
//                 event.stopPropagation();
//             });
//         },

//         _addToMobileToolBar: function () {
//             const resetMapStateControl = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
//             jQuery(this._element).insertAfter(resetMapStateControl);
//         },

//         _addToPluginContainer: function () {
//             const panButtonsControl = jQuery('.mappluginsContent').find('.panbuttons');
//             jQuery(this._element).insertAfter(panButtonsControl);
//         },

//         _toggleToolState: function () {
//             const el = this.getElement();

//             if (this._toolOpen) {
//                 if (el) {
//                     el.removeClass('active');
//                 }
//                 this._toolOpen = false;
//                 this._popup.close(true);
//             } else {
//                 if (el) {
//                     el.addClass('active');
//                 }
//                 this._toolOpen = true;
//                 this._showPopup();
//             }
//         },

//         _showPopup: function () {
//             const loc = this._locale;
//             const popupTitle = loc('display.popup.title');
//             const popupContent = this._popupTemplate.clone();
//             const popupLocation = 'left';
//             const mapmodule = this.getMapModule();
//             const popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');

//             this._popup = popupService.createPopup();
//             ReactDOM.render(
//                 <LocaleContext.Provider value={this.loc}>
//                     <ShadowTool />
//                 </LocaleContext.Provider>, popupContent.get(0));
//             this._popupContent = popupContent;

//             // create close icon
//             this._popup.createCloseIcon();
//             this._popup.onClose(function () {
//                 const el = this.getElement();
//                 if (el) {
//                     el.removeClass('active');
//                 }
//                 this._toolOpen = false;
//             });

//             const themeColours = mapmodule.getThemeColours();
//             this._popup.makeDraggable();
//             this._popup.addClass('shadowtool__popup');

//             this._popup.show(popupTitle, popupContent);
//             const elem = this.getElement();

//             const popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
//             this._popup.setColourScheme({
//                 'bgColour': themeColours.backgroundColour,
//                 'titleColour': themeColours.textColour,
//                 'iconCls': popupCloseIcon
//             });

//             this._popup.moveTo(elem, popupLocation, true);
//         }
//     }, {
//         'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
//         'protocol': [
//             'Oskari.mapframework.module.Module',
//             'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
//         ]
//     }
// );

const BasicMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin');
const className = 'Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin';
/**
 * @class Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin
 */
class ShadowingPlugin extends BasicMapModulePlugin {
    constructor (mapmodule, sandbox) {
        super();
        this._clazz = className;
        this._name = 'ShadowingPlugin';
        this._defaultLocation = 'top right';
        this._time = null;
        this._date = null;
        this._mapmodule = mapmodule;
        this._sandbox = sandbox;
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'ShadowingPlugin3d');
        this._toolOpen = false;
        this._element = null;
        this._popupContent = null;
        this._popup = null;
        this._mountPoint = jQuery('<div class="mapplugin shadow-plugin"><div></div></div>');
        this._popupTemplate = jQuery('<div></div>');
    }
    getName () {
        return className;
    }

    init () {
        // this.sandbox.registerForEventByName(this, 'AfterMapMoveEvent');
    }

    _createEventHandlers () {
        return {
            TimeChangedEvent: function (event) {
                this._time = event.getTime();
                this._date = event.getDate();
            }
        };
    }

    onEvent (event) {
        console.log(event);
    }

    getElement () {
        return this._element;
    }

    getMapModule () {
        return this._mapmodule;
    }

    getSandBox () {
        return this._sandbox;
    }

    _teardownUI () {
        if (!this.getElement()) {
            return;
        }
        ReactDOM.unmountComponentAtNode(this.getElement().get(0));
        this.getElement().detach();
    }

    stopPlugin () {
        this._teardownUI();
    }

    _createUI (mapInMobileMode) {
        this._element = this._mountPoint.clone();

        if (mapInMobileMode) {
            this._element.css('display', 'inline-block');
            this._addToMobileToolBar();
        } else {
            this._addToPluginContainer();
        }

        this._createControlElement();

        ReactDOM.render(
            <LocaleContext.Provider value={this.loc}>
                <ShadowControl mapInMobileMode={mapInMobileMode}/>
            </LocaleContext.Provider>, this._element.get(0));
    }

    _createControlElement () {
        const me = this;
        const el = this.getElement();

        el.off('click');
        el.on('click', function (event) {
            me._toggleToolState();
            event.stopPropagation();
        });
    }

    _addToMobileToolBar () {
        const resetMapStateControl = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
        jQuery(this._element).insertAfter(resetMapStateControl);
    }

    _addToPluginContainer () {
        const panButtonsControl = jQuery('.mappluginsContent').find('.panbuttons');
        jQuery(this._element).insertAfter(panButtonsControl);
    }

    _toggleToolState () {
        const el = this.getElement();

        if (this._toolOpen) {
            if (el) {
                el.removeClass('active');
            }
            this._toolOpen = false;
            this._popup.close(true);
        } else {
            if (el) {
                el.addClass('active');
            }
            this._toolOpen = true;
            this._showPopup();
        }
    }

    _showPopup () {
        const loc = this._locale;
        const popupTitle = loc('display.popup.title');
        const popupContent = this._popupTemplate.clone();
        const popupLocation = 'left';
        const mapmodule = this.getMapModule();
        const popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');

        this._popup = popupService.createPopup();
        ReactDOM.render(
            <LocaleContext.Provider value={this.loc}>
                <ShadowTool />
            </LocaleContext.Provider>, popupContent.get(0));
        this._popupContent = popupContent;

        // create close icon
        this._popup.createCloseIcon();
        this._popup.onClose(function () {
            const el = this.getElement();
            if (el) {
                el.removeClass('active');
            }
            this._toolOpen = false;
        });

        const themeColours = mapmodule.getThemeColours();
        this._popup.makeDraggable();
        this._popup.addClass('shadowtool__popup');

        this._popup.show(popupTitle, popupContent);
        const elem = this.getElement();

        const popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
        this._popup.setColourScheme({
            'bgColour': themeColours.backgroundColour,
            'titleColour': themeColours.textColour,
            'iconCls': popupCloseIcon
        });

        this._popup.moveTo(elem, popupLocation, true);
    }
}

Oskari.clazz.defineES('Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin',
    ShadowingPlugin,
    {
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
