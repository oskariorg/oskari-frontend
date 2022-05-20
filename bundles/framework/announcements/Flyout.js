import React from 'react';
import ReactDOM from 'react-dom';
import { FlyoutCollapse, FlyoutFooter } from './view/';
import { LocaleProvider } from 'oskari-ui/util';

/**
 * @class Oskari.framework.bundle.announcements.Flyout
 *
 * Renders the announcements flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.announcements.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.announcements.AnnouncementsBundleInstance} instance
     *    reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.announcementsHandler = null;
        this.container = null;
    }, {
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
        },

        /**
         * Interface method implementation, does nothing atm
         * @method startPlugin
         */
        startPlugin: function () {
            this.announcementsHandler !== null && this.render();
        },

        /**
        * Cretes AnnouncementsHandler with given service
        * @method createAnnouncementsHandler
        */
        initHandler: function (handler) {
            this.announcementsHandler = handler;
            this.announcementsHandler.addStateListener(() => this.render());
        },

        /**
         * @method render
         * Renders React content
         */
        render: function () {
            if (!this.container) {
                return;
            }
            const { tools, ...state } = this.announcementsHandler.getState();
            const footerTools = tools.filter(tool => tool.getTypes().includes('footer'));
            const announcementTools = tools.filter(tool => tool.getTypes().includes('announcement'));
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <FlyoutCollapse
                        {...state}
                        tools = {announcementTools}
                        controller={this.announcementsHandler.getController()}
                    />
                    <FlyoutFooter tools={footerTools} />
                </LocaleProvider>
            );
            ReactDOM.render(content, this.container);
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
