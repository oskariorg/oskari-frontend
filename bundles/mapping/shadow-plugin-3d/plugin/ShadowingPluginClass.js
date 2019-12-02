import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleContext } from 'oskari-ui/util';
import { ShadowControl } from '../view/ShadowControl/';

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
        this._element = null;
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'ShadowingPlugin3d');
        this._toolOpen = false;
        this._popup = null;
        this._mountPoint = jQuery('<div class="mapplugin shadow-plugin"><div></div></div>');
    }
    getName () {
        return className;
    }

    init () {
        this.sandbox.registerForEventByName(this, 'AfterMapMoveEvent');
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
        ReactDOM.render(
            <LocaleContext.Provider value={this.loc}>
                <ShadowControl mapInMobileMode={mapInMobileMode}/>
            </LocaleContext.Provider>, this._element.get(0));
    }

    _addToMobileToolBar () {
        const resetMapStateControl = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
        jQuery(this._element).insertAfter(resetMapStateControl);
    }

    _addToPluginContainer () {
        const panButtonsControl = jQuery('.mappluginsContent').find('.panbuttons');
        jQuery(this._element).insertAfter(panButtonsControl);
    }

    toggleToolState () {
        var el = this.getElement();

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
        const popupContent = this._templates.popupContent.clone();
        const popupLocation = 'left';
        const mapmodule = this.getMapModule();
        const popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');

        this._popup = popupService.createPopup();
        // Insert React here
        this._popupContent = popupContent;

        // create close icon
        this._popup.createCloseIcon();
        this._popup.onClose(function () {
            var el = this.getElement();
            if (el) {
                el.removeClass('active');
            }
            this._toolOpen = false;
        });

        var themeColours = mapmodule.getThemeColours();
        var popupCloseIcon = null;
        this._popup.makeDraggable();
        this._popup.addClass('shadowtool__popup');

        this._popup.show(popupTitle, popupContent);
        const elem = this.getElement();

        popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
        this._popup.setColourScheme({
            'bgColour': themeColours.backgroundColour,
            'titleColour': themeColours.textColour,
            'iconCls': popupCloseIcon
        });

        // show mouse coordinates
        popupContent.find('div.mousecoordinates-div').show();

        this._popup.moveTo(elem, popupLocation, true);

        this.refresh();
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
