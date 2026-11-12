import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { FlyoutContent } from './flyout/FlyoutContent';

export class AnnouncementsView {
    constructor (instance) {
        this.instance = instance;
    }

    getContent (state) {
        const handler = this.instance.handler;
        if (!handler) {
            return null;
        }
        return (
            <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                <ThemeProvider>
                    <FlyoutContent
                        { ...state }
                        toolController={handler.getToolController()}
                        controller={handler.getController()}
                    />
                </ThemeProvider>
            </LocaleProvider>
        );
    }
}
