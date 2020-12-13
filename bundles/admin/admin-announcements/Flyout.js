import React from 'react';
import ReactDOM from 'react-dom';
import { AnnouncementsList, AnnouncementsListHandler } from './view/';
import { LocaleProvider } from 'oskari-ui/util';

/**
 * @class Oskari.admin.bundle.admin-announcements.Flyout
 *
 * Renders the admin-announcements flyout.
 */
Oskari.clazz.define('Oskari.admin.bundle.admin-announcements.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.admin.bundle.admin-announcements.Flyout} instance
     *    reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.AnnouncementsListHandler = new AnnouncementsListHandler(this.instance);
        this.AnnouncementsListHandler.addStateListener(() => this.render());
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
            this.render();
        },

        /**
         * @method render
         * Renders React content
         */
        render: function () {
            if (!this.container) {
                return;
            }
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <AnnouncementsList
                        {...this.AnnouncementsListHandler.getState()}
                        controller={this.AnnouncementsListHandler.getController()}
                    />
                </LocaleProvider>
            );
            ReactDOM.render(content, this.container);
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
