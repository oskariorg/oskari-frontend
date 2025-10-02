import React from 'react';
import { AccountTab } from './view/Account/AccountTab';
import { Tabs } from 'antd';
import { MyDataHandler } from './handler/MyDataHandler';
import { MyViewsTab } from './view/MyViews/MyViewsTab';
import { FlyoutContent } from './FlyoutContent';
import { PublishedMapsHandler } from './handler/PublishedMapsHandler';
import { MyViewsHandler } from './handler/MyViewsHandler';
import { PublishedMapsTab } from './view/PublishedMaps/PublishedMapsTab';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import './service/MyDataService';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mydata.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mydata.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mydata.MyDataBundleInstance} instance
     *     reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;

        this.uiHandler = new MyDataHandler(() => this.update());
        this.myDataService = null;
        this._reactRoot = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.mydata.Flyout';
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
            if (!jQuery(this.container).hasClass('mydata')) {
                jQuery(this.container).addClass('mydata');
            }
            if (!flyout.hasClass('mydata')) {
                flyout.addClass('mydata');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            if (Oskari.user().isLoggedIn()) {
                this.myDataService = Oskari.clazz.create('Oskari.mapframework.bundle.mydata.service.MyDataService', this.uiHandler);
                Oskari.getSandbox().registerService(this.myDataService);

                if (this.instance.conf && this.instance.conf.showUser) {
                    this.myDataService.addTab(
                        'account',
                        Oskari.getMsg('MyData', 'tabs.account.title'),
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
                }
                if (this.instance.conf && this.instance.conf.showViews) {
                    this.myDataService.addTab(
                        'myviews',
                        Oskari.getMsg('MyData', 'tabs.myviews.title'),
                        MyViewsTab,
                        new MyViewsHandler(this.instance)
                    );
                }
                this.myDataService.addTab(
                    'publishedmaps',
                    Oskari.getMsg('MyData', 'tabs.publishedmaps.title'),
                    PublishedMapsTab,
                    new PublishedMapsHandler(this.instance)
                );
            }

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
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        update: function () {
            const flyout = jQuery(this.container);

            const {
                tabs,
                activeTab
            } = this.uiHandler.getState();
            this.getReactRoot(flyout[0]).render(
                <LocaleProvider value={{ bundleKey: 'MyData' }}>
                    <ThemeProvider>
                        <FlyoutContent loginStatus={this.getLoginStatus()}>
                            <Tabs
                                activeKey={activeTab}
                                onChange={(tab) => this.uiHandler.setActiveTab(tab)}
                                items={tabs.map(t => (
                                    {
                                        key: t.id,
                                        label: <span className={ 't_tab t_' + t.id }>{t.title}</span>,
                                        children: (
                                            <t.component
                                                state={t.handler.getState()}
                                                controller={t.handler.getController()}
                                            />
                                        )
                                    }
                                ))}
                            />
                        </FlyoutContent>
                    </ThemeProvider>
                </LocaleProvider>
            );
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            this.update();
            this.addProfileLink();
        },
        addProfileLink: function () {
            jQuery('#oskari-profile-link').on('click', () => {
                this.openProfileTab();
                return false;
            });
        },
        openProfileTab: function () {
            Oskari.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'attach']);
            this.uiHandler.setActiveTab('account');
        },
        /**
         * @method getLoginUrl
         * @returns {String}
         */
        getLoginStatus: function () {
            const conf = this.instance.conf || {};
            return {
                loggedIn: Oskari.user().isLoggedIn(),
                loginUrl: Oskari.getLocalized(conf.logInUrl) || Oskari.urls.getLocation('login'),
                registerUrl: Oskari.urls.getLocation('register')
            };
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
