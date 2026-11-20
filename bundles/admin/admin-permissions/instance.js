import React from 'react';
import { NavigationAdapter } from 'oskari-ui/util/NavigationAdapter';
import { showFlyout } from 'oskari-ui/components/window';
import { styled } from 'styled-components';
import { AdminPermissionsView } from './view/AdminPermissionsView';
import './Flyout';
import './Tile';

const FLYOUT_ID = 'AdminPermissions';
const FLYOUT_TITLE_KEY = 'flyout.title';
const FlyoutPadding = styled('div')`
    margin: 0;
    padding: 1.5em 1.5em 1.5em 1.75em;
`;

/**
 * @class Oskari.admin.bundle.admin-layerrights.AdminLayerRightsBundleInstance
 *
 * Main component and starting point for the layer rights management functionality.
 *
 * See Oskari.admin.bundle.admin-layerrights.AdminLayerRightsBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.admin.bundle.admin-permissions.AdminPermissionsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.loc = Oskari.getMsg.bind(null, this.getName());
        this.adminPermissionsView = null;
        this.mainNavigationControls = null;
        this.navigation = new NavigationAdapter(this, {
            createMenuItem: (navigation) => this.createMenuItem(navigation),
            onStart: () => {
                this.adminPermissionsView = new AdminPermissionsView(this, () => this.updateMainNavigationFlyout());
            },
            onStop: () => {
                this.closeMainNavigationFlyout();
                this.adminPermissionsView = null;
            }
        });
    }, {

        /**
         * @static
         * @property __name
         */
        __name: 'admin-permissions',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
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
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            if (this.started) {
                return;
            }
            this.started = true;
            const conf = this.conf || {};
            const sandboxName = conf.sandbox || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox.register(this);
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));
            // Let's extend UI
            this.navigation.start();

            // draw ui
            if (!this.navigation.service) {
                this.createUi();
            }
        },

        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does
         * nothing atm
         */
        update: function () {

        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const result = this.navigation.stop();
            if (this.navigation.service) {
                return result;
            }
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.unregisterFromEventByName(this, p));

            this.sandbox.unregister(this);
            this.started = false;
        },
        createMenuItem: function ({ MenuItem, MenuItemActivationResult }) {
            const menuItem = new MenuItem({
                bundleId: this.mediator.bundleId,
                sortOrder: 70,
                name: this.getTitle(),
                setActive: (isActive) => {
                    if (isActive) {
                        const opened = this.showMainNavigationFlyout(() => menuItem.onClose?.(menuItem.getMenuItemId()));
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
            const controls = showFlyout(this.loc(FLYOUT_TITLE_KEY), this.getPaddedFlyoutContent(), () => {
                if (this.mainNavigationControls !== controls) {
                    return;
                }
                this.mainNavigationControls = null;
                this.adminPermissionsView.reset();
                onClose();
            }, {
                id: FLYOUT_ID
            });
            if (!controls) {
                return false;
            }
            this.mainNavigationControls = controls;
            return true;
        },
        closeMainNavigationFlyout: function () {
            const controls = this.mainNavigationControls;
            this.mainNavigationControls = null;
            controls?.close();
            if (controls) {
                this.adminPermissionsView.reset();
            }
        },
        getPaddedFlyoutContent: function () {
            return (
                <FlyoutPadding>
                    {this.adminPermissionsView.getContent()}
                </FlyoutPadding>
            );
        },
        updateMainNavigationFlyout: function () {
            this.mainNavigationControls?.update(this.loc(FLYOUT_TITLE_KEY), this.getPaddedFlyoutContent());
        },

        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol
         * startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.publisher.Flyout
         * Oskari.mapframework.bundle.publisher.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] =
                Oskari.clazz.create('Oskari.admin.bundle.admin-permissions.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] =
                Oskari.clazz.create('Oskari.admin.bundle.admin-permissions.Tile', this);
        },

        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol
         * stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },

        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins
         * method
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
            return this.loc('title');
        },

        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].renderContent();
        },
        closeFlyout: function () {
            if (this.navigation.service) {
                return this.navigation.service.setActive(this.navigation.menuItem.getMenuItemId(), false);
            }
            this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Reset flyout when closed
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                if (this.navigation.service || event.getExtension().getName() !== this.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (event.getViewState() === 'close') {
                    this.plugins['Oskari.userinterface.Flyout'].resetFlyout();
                }
            }
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);
