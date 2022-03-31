import React from 'react';
import ReactDOM from 'react-dom';
import { AccountTab } from './view/Account/AccountTab';
import { Tabs } from 'antd';
import { MyDataHandler } from './MyDataHandler';
import { MyViewsTab } from './view/MyViews//MyViewsTab';

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
        this.tabsData = [];
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
            var me = this;
            // TODO: move these to correct bundle and use AddTabRequest to add itself to PersonalData
            this.tabsData = {
                /* 'myviews': Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyViewsTab', me.instance),
                'publishedmaps': Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.PublishedMapsTab', me.instance),
                // TODO should we pass conf to accounttab here?
                'account': {
                    getTitle: () => Oskari.getMsg('PersonalData', `tabs.account.title`),
                    // eslint seems to think this is defining a new unnamed component
                    // eslint-disable-next-line react/display-name
                    getJsx: () => <AccountTab user={Oskari.user()} changeInfoUrl={Oskari.urls.getLocation('profile')} />,
                    sideEffects: [
                        () => {
                            jQuery('#oskari-profile-link').on('click', function () {
                                me.instance.openProfileTab();
                                return false;
                            });
                        }
                    ]
                } */
                //'account': <AccountTab user={Oskari.user()} changeInfoUrl={Oskari.urls.getLocation('profile')} />,
                //'myviews': 2
            };

            const controller = this.uiHandler.getController();
            const { views } = this.uiHandler.getState();

            const updateAccountTab = this.addTab(
                'account',
                Oskari.getMsg('PersonalData', 'tabs.account.title'),
                <AccountTab user={Oskari.user()} changeInfoUrl={Oskari.urls.getLocation('profile')} />
            );
            const updateMyViewsTab = this.addTab(
                'myviews',
                Oskari.getMsg('PersonalData', 'tabs.myviews.title'),
                <MyViewsTab
                    controller={controller}
                    data={views}
                />
            )
            this.uiHandler.refreshViewsList();
            this.update();
/* 
            {tabs.map(t => (
                <TabPane tab={'account'} key='account'>
                    {t.component}
                </TabPane>
            ))}
            <TabPane tab={'myviews'} key={'myviews'}>
                <MyViewsTab
                    data={views}
                    openView={(item) => this.uiHandler.openView(item)}
                    setDefault={(item) => this.uiHandler.setDefaultView(item)}
                    handleEdit={(item) => this.uiHandler.editView(item)}
                    handleDelete={(item) => this.uiHandler.deleteView(item)}
                    saveCurrent={() => this.uiHandler.saveCurrent()}
                />
            </TabPane> */
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

            const tabKeys = Object.keys(this.tabsData);

            const { TabPane } = Tabs;

            const {
                tabs
            } = this.uiHandler.getState();

            const tabContainer = <Tabs defaultActiveKey={tabKeys && tabKeys > 0 ? tabKeys[0] : null}>
               {tabs.map(t => (
                   <TabPane tab={t.title} key={t.id}>
                       {t.component}
                   </TabPane>
               ))}
            </Tabs>;

            ReactDOM.render(tabContainer, flyout[0]);

           /*  // now we can presume user is logged in
            Object.keys(this.tabsData).forEach(function (tabId) {
                var tab = me.tabsData[tabId];
                var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                panel.setTitle(tab.getTitle());
                panel.setId(tabId);

                if (tab.hasOwnProperty('getJsx')) {
                    const container = document.createElement('div');
                    panel.setContent(container);
                    ReactDOM.render(tab.getJsx(), container);
                } else {
                    tab.addTabContent(panel.getContainer());
                }

                if (tab.sideEffects) {
                    tab.sideEffects.forEach(func => func());
                }

                // binds tab to events
                if (tab.bindEvents) {
                    tab.bindEvents();
                }
                me.tabsContainer.addPanel(panel);
            }); */

        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
         createUi: function () {
            // clear container
            var flyout = jQuery(this.container);

            const loggedIn = Oskari.user().isLoggedIn();
            var notLoggedInFullText = this.instance.getLocalization('notLoggedIn');
            var conf = this.instance.conf || {};

            // in analyse/publisher it's conf.loginUrl - in here it's conf.logInUrl !!
            var loginUrl = Oskari.getLocalized(conf.logInUrl) || Oskari.urls.getLocation('login');
            if (loginUrl) {
                notLoggedInFullText += '<br/><br/>' +
                    '<a href="' + loginUrl + '">' + this.instance.getLocalization('notLoggedInText') + '</a>';
            }
            var registerUrl = Oskari.urls.getLocation('register');
            if (registerUrl) {
                notLoggedInFullText += '<br/><br/>' +
                    '<a href="' + registerUrl + '">' + this.instance.getLocalization('register') + '</a>';
            }

            this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', loggedIn ? '' : notLoggedInFullText);

            this.tabsContainer.insertTo(flyout);

            if (!loggedIn) {
                return;
            }
         },
        /**
         *
         *
         */
        addTab: function (id, title, component) {
            if (!Oskari.user().isLoggedIn()) {
                return;
            }

            if (id === 'account' || id === 'myviews') {
                this.uiHandler.addTab(id, title, component);
            }

            return (updatedComponent) => {
                uiHandler.updateTab(id, updatedComponent)
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
