import React from 'react';
import ReactDOM from 'react-dom';
import { AccountTab } from './view/Account/AccountTab';
import { Tabs } from 'antd';
import { MyDataHandler } from './handler/MyDataHandler';
import { MyViewsTab } from './view/MyViews/MyViewsTab';
import { FlyoutContent } from './FlyoutContent';
import { PublishedMapsHandler } from './handler/PublishedMapsHandler';
import { MyViewsHandler } from './handler/MyViewsHandler';
import { PublishedMapsTab } from './view/PublishedMaps/PublishedMapsTab';

/**
 * @class Oskari.mapframework.bundle.personaldata.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
     *     reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;

        this.template = null;
        this.templateTabHeader = null;
        this.templateTabContent = null;
        this.uiHandler = new MyDataHandler(() => this.update());
        this.element = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.personaldata.Flyout';
        },
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
            if (!jQuery(this.container).hasClass('personaldata')) {
                jQuery(this.container).addClass('personaldata');
            }
            if (!flyout.hasClass('personaldata')) {
                flyout.addClass('personaldata');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            /* jQuery('#oskari-profile-link').on('click', function () {
                me.instance.openProfileTab();
                return false;
            }); */

            this.addTab(
                'account',
                Oskari.getMsg('PersonalData', 'tabs.account.title'),
                AccountTab,
                {
                    getState: () => ({
                        user: Oskari.user(),
                        changeInfoUrl: Oskari.urls.getLocation('profile')
                    }),
                    getController: () => null,
                    addStateListener: () => null
                }
            );
            this.addTab(
                'myviews',
                Oskari.getMsg('PersonalData', 'tabs.myviews.title'),
                MyViewsTab,
                new MyViewsHandler()
            );
            this.addTab(
                'publishedmaps',
                Oskari.getMsg('PersonalData', 'tabs.publishedmaps.title'),
                PublishedMapsTab,
                new PublishedMapsHandler()
            );

            this.update();
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *     state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        update: function () {
            const flyout = jQuery(this.container);

            const { TabPane } = Tabs;

            const {
                tabs
            } = this.uiHandler.getState();

            ReactDOM.render(
                <FlyoutContent loginStatus={this.getLoginStatus()}>
                    <Tabs>
                        {tabs.map(t => (
                            <TabPane tab={t.title} key={t.id}>
                                <t.component
                                    state={t.handler.getState()}
                                    controller={t.handler.getController()}
                                />
                            </TabPane>
                        ))}
                    </Tabs>
                </FlyoutContent>
                ,
                flyout[0]
            );
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            this.update();
        },
        /**
         * @method getLoginUrl
         * @returns {String}
         */
        getLoginStatus: function () {
            const notLoggedInText = this.instance.getLocalization('notLoggedIn');
            const conf = this.instance.conf || {};
            const loginUrl = Oskari.getLocalized(conf.logInUrl) || Oskari.urls.getLocation('login');

            const registerUrl = Oskari.urls.getLocation('register');

            return {
                loggedIn: Oskari.user().isLoggedIn(),
                notLoggedInText,
                loginUrl,
                registerUrl
            };
        },
        /**
         *
         *
         */
        addTab: function (id, title, component, handler) {
            if (!Oskari.user().isLoggedIn()) {
                return;
            }
            if (handler && typeof handler.addStateListener === 'function') {
                handler.addStateListener(() => this.update());
                this.uiHandler.addTab(id, title, component, handler);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
