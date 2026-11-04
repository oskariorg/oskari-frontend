import React from 'react';
import { AccountTab } from './Account/AccountTab';
import { Tabs } from 'oskari-ui';
import { MyDataHandler } from '../handler/MyDataHandler';
import { MyViewsTab } from './MyViews/MyViewsTab';
import { FlyoutContent } from '../FlyoutContent';
import { PublishedMapsHandler } from '../handler/PublishedMapsHandler';
import { MyViewsHandler } from '../handler/MyViewsHandler';
import { PublishedMapsTab } from './PublishedMaps/PublishedMapsTab';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import '../service/MyDataService';

const BUNDLE_NAME = 'MyData';
const MY_DATA_SERVICE = 'Oskari.mapframework.bundle.mydata.service.MyDataService';
const ACCOUNT_TAB_ID = 'account';
const MY_VIEWS_TAB_ID = 'myviews';
const PUBLISHED_MAPS_TAB_ID = 'publishedmaps';
const PROFILE_LOCATION = 'profile';
const LOGIN_LOCATION = 'login';
const REGISTER_LOCATION = 'register';

export class MyDataView {
    constructor (instance, onChange) {
        this.instance = instance;
        this.onChange = onChange;
        this.uiHandler = new MyDataHandler(() => this.onChange?.());
        this.myDataService = null;
    }

    start () {
        if (Oskari.user().isLoggedIn()) {
            this.myDataService = Oskari.clazz.create(MY_DATA_SERVICE, this.uiHandler);
            this.instance.getSandbox().registerService(this.myDataService);

            if (this.instance.conf && this.instance.conf.showUser) {
                this.myDataService.addTab(
                    ACCOUNT_TAB_ID,
                    Oskari.getMsg(BUNDLE_NAME, `tabs.${ACCOUNT_TAB_ID}.title`),
                    AccountTab,
                    {
                        getState: () => ({
                            user: Oskari.user(),
                            changeInfoUrl: Oskari.urls.getLocation(PROFILE_LOCATION)
                        }),
                        getController: () => null,
                        addStateListener: () => null
                    }
                );
            }
            if (this.instance.conf && this.instance.conf.showViews) {
                this.myDataService.addTab(
                    MY_VIEWS_TAB_ID,
                    Oskari.getMsg(BUNDLE_NAME, `tabs.${MY_VIEWS_TAB_ID}.title`),
                    MyViewsTab,
                    new MyViewsHandler(this.instance)
                );
            }
            this.myDataService.addTab(
                PUBLISHED_MAPS_TAB_ID,
                Oskari.getMsg(BUNDLE_NAME, `tabs.${PUBLISHED_MAPS_TAB_ID}.title`),
                PublishedMapsTab,
                new PublishedMapsHandler(this.instance)
            );
        }
    }

    stop () {
        this.onChange = null;
        if (this.myDataService) {
            this.instance.getSandbox().unregisterService(MY_DATA_SERVICE);
            this.myDataService = null;
        }
    }

    selectAccountTab () {
        this.uiHandler.setActiveTab(ACCOUNT_TAB_ID);
    }

    getContent () {
        const {
            tabs,
            activeTab
        } = this.uiHandler.getState();
        return (
            <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
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
    }

    getLoginStatus () {
        const conf = this.instance.conf || {};
        return {
            loggedIn: Oskari.user().isLoggedIn(),
            loginUrl: Oskari.getLocalized(conf.logInUrl) || Oskari.urls.getLocation(LOGIN_LOCATION),
            registerUrl: Oskari.urls.getLocation(REGISTER_LOCATION)
        };
    }
}
