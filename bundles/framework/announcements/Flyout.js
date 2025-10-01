import React from 'react';
import { FlyoutContent } from './view/';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { createRoot } from 'react-dom/client';

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
        this._reactRoot = null;
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
        setEl: function (el, flyout) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('announcements')) {
                jQuery(this.container).addClass('announcements');
            }
            if (!flyout.hasClass('announcements')) {
                flyout.addClass('announcements');
            }
        },

        /**
        * Cretes AnnouncementsHandler with given service
        * @method createAnnouncementsHandler
        */
        initHandler: function (handler) {
            this.announcementsHandler = handler;
            this.announcementsHandler.addStateListener((state) => this.render(state));
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @method render
         * Renders React content
         */
        render: function (state) {
            if (!this.container) {
                return;
            }
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <ThemeProvider>
                        <FlyoutContent
                            { ...state }
                            toolController = {this.announcementsHandler.getToolController()}
                            controller={this.announcementsHandler.getController()}
                        />
                    </ThemeProvider>
                </LocaleProvider>
            );
            this.getReactRoot(this.container).render(content);
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultFlyout']
    });
