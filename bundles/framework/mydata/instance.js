import './Tile';
import './Flyout';
import './service/ViewService';
import React from 'react';
import { Message } from 'oskari-ui';
import { NavigationAdapter } from 'oskari-ui/util/NavigationAdapter';
import { showFlyout } from 'oskari-ui/components/window';
import { styled } from 'styled-components';
import { MyDataView } from './view/MyDataView';

const MENU_ITEM_ID = 'mydata-item';
const FLYOUT_PLUGIN = 'Oskari.userinterface.Flyout';
const TILE_PLUGIN = 'Oskari.userinterface.Tile';
const PROFILE_LINK_ID = 'oskari-profile-link';
const UPDATE_EXTENSION_REQUEST = 'userinterface.UpdateExtensionRequest';
const ATTACH = 'attach';
const CLOSE = 'close';
const FLYOUT_ID = 'MyData';
const FlyoutPadding = styled('div')`
    margin: 0;
    padding: 1.5em 1.5em 1.5em 1.75em;
`;

/**
 * @class Oskari.mapframework.bundle.mydata.MyDataBundleInstance
 *
 * Main component and starting point for the personal data functionality.
 *
 * See Oskari.mapframework.bundle.mydata.MyDataBundle for bundle definition.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mydata.MyDataBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.core = null;
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.viewService = null;
        this.mainNavigationControls = null;
        this.myDataView = null;
        this.profileLink = null;
        this.onProfileLinkClick = (event) => {
            event.preventDefault();
            this.openProfileTab();
        };
        this.navigation = new NavigationAdapter(this, {
            createMenuItem: (navigation) => this.createMenuItem(navigation),
            onStart: () => {
                this.myDataView = new MyDataView(this, () => this.updateMainNavigationFlyout());
                this.myDataView.start();
            },
            onStop: () => {
                this.closeMainNavigationFlyout();
                this.myDataView.stop();
                this.myDataView = null;
            }
        });
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'MyData',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        'getName': function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getViewService
         * @return {Oskari.mapframework.bundle.mydata.service.ViewService}
         */
        getViewService: function () {
            return this.viewService;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            var me = this;

            if (me.started) {
                return;
            }

            me.started = true;

            const conf = this.conf || {};
            this.conf = conf;
            const sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);
            let p;

            me.sandbox = sandbox;
            this.viewService = Oskari.clazz.create('Oskari.mapframework.bundle.mydata.service.ViewService');

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            // Let's extend UI
            this.navigation.start();

            // draw ui
            me.createUi();

            this._registerForGuidedTour();
        },
        /**
         * @method init
         * implements Module protocol init method - adds tab request handler
         */
        'init': function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        'update': function () {

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
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {},

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const sandbox = this.sandbox;
            let p;
            for (p in this.eventHandlers) {
                if (Object.prototype.hasOwnProperty.call(this.eventHandlers, p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            this.navigation.stop();
            this.profileLink?.removeEventListener('click', this.onProfileLinkClick);
            this.profileLink = null;

            this.sandbox.unregister(this);
            this.started = false;
        },
        getMainNavigationService: function () {
            return this.navigation.service;
        },
        createMenuItem: function ({ MenuItem, MenuItemActivationResult }) {
            const menuItem = new MenuItem({
                id: MENU_ITEM_ID,
                name: this.getTitle(),
                tooltip: this.getDescription(),
                setActive: (isActive) => {
                    if (isActive) {
                        const opened = this.showMainNavigationFlyout(() => menuItem.onClose?.(MENU_ITEM_ID));
                        return opened ? MenuItemActivationResult.OK : MenuItemActivationResult.FAILED;
                    }
                    this.closeMainNavigationFlyout();
                    return MenuItemActivationResult.OK;
                }
            });
            return menuItem;
        },
        showMainNavigationFlyout: function (onClose) {
            if (this.mainNavigationControls) {
                return true;
            }
            const controls = showFlyout(this.getTitle(), this.getPaddedFlyoutContent(), () => {
                if (this.mainNavigationControls !== controls) {
                    return;
                }
                this.mainNavigationControls = null;
                onClose();
            }, { id: FLYOUT_ID });
            if (!controls) {
                return false;
            }
            this.mainNavigationControls = controls;
            return true;
        },
        closeMainNavigationFlyout: function () {
            const controls = this.mainNavigationControls;
            this.mainNavigationControls = null;
            try {
                controls?.close();
            } catch (error) {
                this.mainNavigationControls = controls;
                throw error;
            }
        },
        // Divmanazer supplies its own padding; the modern window needs a wrapper.
        getPaddedFlyoutContent: function () {
            return <FlyoutPadding>{this.myDataView.getContent()}</FlyoutPadding>;
        },
        updateMainNavigationFlyout: function () {
            this.mainNavigationControls?.update(this.getTitle(), this.getPaddedFlyoutContent());
        },
        /** Opens the personal data flyout in the configured navigation. */
        openFlyout: function () {
            const service = this.getMainNavigationService();
            if (service) {
                return service.setActive(MENU_ITEM_ID, true);
            }
            this.sandbox.postRequestByName(UPDATE_EXTENSION_REQUEST, [this, ATTACH]);
        },
        closeFlyout: function () {
            const service = this.getMainNavigationService();
            if (service) {
                return service.setActive(MENU_ITEM_ID, false);
            }
            this.sandbox.postRequestByName(UPDATE_EXTENSION_REQUEST, [this, CLOSE]);
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.mydata.Flyout
         * Oskari.mapframework.bundle.mydata.Tile
         */
        startExtension: function () {
            this.plugins[FLYOUT_PLUGIN] = Oskari.clazz.create('Oskari.mapframework.bundle.mydata.Flyout', this);
            this.plugins[TILE_PLUGIN] = Oskari.clazz.create('Oskari.mapframework.bundle.mydata.Tile', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins[FLYOUT_PLUGIN].stopPlugin();
            this.plugins[FLYOUT_PLUGIN] = null;
            this.plugins[TILE_PLUGIN] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return Oskari.getMsg(this.getName(), 'title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return Oskari.getMsg(this.getName(), 'desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "personal data" functionality
         */
        createUi: function () {
            if (!this.getMainNavigationService()) {
                this.plugins[FLYOUT_PLUGIN].createUi();
                this.plugins[TILE_PLUGIN].refresh();
            }
            this.profileLink?.removeEventListener('click', this.onProfileLinkClick);
            this.profileLink = document.getElementById(PROFILE_LINK_ID);
            this.profileLink?.addEventListener('click', this.onProfileLinkClick);
        },
        openProfileTab: function () {
            this.openFlyout();
            const view = this.myDataView || this.plugins[FLYOUT_PLUGIN].myDataView;
            view.selectAccountTab();
        },
        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 40,
            show: function () {
                this.openFlyout();
            },
            hide: function () {
                this.closeFlyout();
            },
            getTitle: function () {
                return Oskari.getMsg(this.getName(), 'guidedTour.title');
            },
            getContent: function () {
                return <Message bundleKey={this.getName()} messageKey='guidedTour.message' allowHTML />;
            },
            getLinks: function () {
                var me = this;
                return [
                    {
                        title: Oskari.getMsg(this.getName(), 'guidedTour.openLink'),
                        onClick: () => me.openFlyout(),
                        visible: false
                    },
                    {
                        title: Oskari.getMsg(this.getName(), 'guidedTour.closeLink'),
                        onClick: () => me.closeFlyout(),
                        visible: true
                    }
                ];
            }
        },

        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function () {
            var me = this;
            function sendRegister () {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder && me.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for (var prop in me.__guidedTourDelegateTemplate) {
                        if (typeof me.__guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler (msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
