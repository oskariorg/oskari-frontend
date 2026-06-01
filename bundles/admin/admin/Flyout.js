import React from 'react';
import { Tabs } from 'antd';
import { ThemeProvider, LocaleProvider } from 'oskari-ui/util';
import { getReactRoot } from 'oskari-ui/components/window';
import { DefaultViewsContent } from './DefaultViews.js';

const BUNDLE_KEY = 'GenericAdmin';

export class GenericAdminFlyout {
    constructor (instance) {
        this.instance = instance;
        this.container = null;
        this.dynamicTabs = [];
    }

    setEl (el, flyout) {
        this.container = el[0];
        this.container.classList.add('admin');
        flyout[0].classList.add('admin');
    }

    getTitle () {
        return Oskari.getMsg(BUNDLE_KEY, 'flyout.title');
    }

    startPlugin () {}

    createUI () {
        this.render();
    }

    addTab (item) {
        this.dynamicTabs.push(item);
        if (this.container) {
            this.render();
        }
    }

    render () {
        const items = [
            {
                key: 'defaultviews',
                label: Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.title'),
                children: <DefaultViewsContent instance={this.instance} />
            },
            ...this.dynamicTabs.map(tab => ({
                key: tab.id,
                label: tab.title,
                children: tab.content
            }))
        ];
        getReactRoot(this.container).render(
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <ThemeProvider>
                    <Tabs items={items} />
                </ThemeProvider>
            </LocaleProvider>
        );
    }
}