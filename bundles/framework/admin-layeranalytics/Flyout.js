import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { LayerAnalyticsContent } from './LayerAnalyticsContent';

Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.Flyout',

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.flyout = null;
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    }, {
        __name: 'Oskari.framework.bundle.admin-layeranalytics.Flyout',
        getName: function () {
            return this.__name;
        },
        getTitle: function () {
            return this.instance.getLocalization('flyout.title');
        },
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
            this.flyout = flyout;
            this.container.classList.add('admin-layeranalytics');
            this.flyout.addClass('admin-layeranalytics');
        },
        /**
         * Renders content for flyout UI
         * @method createContent
         */
        createContent: function () {
            const root = this.container;
            if (!root) {
                return;
            }

            this.progressSpinner.insertTo(root);

            this.updateListing();
        },
        updateListing: function () {
            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <LayerAnalyticsContent analyticsData={[...this.instance.getAnalyticsData()]} />
                </LocaleProvider>,
                this.container
            );
        },
        startPlugin: function () {},
        setSpinnerState: function (spinnerState) {
            if (!spinnerState) {
                this.progressSpinner.stop();
            } else {
                this.progressSpinner.start();
            }
        }
    }
);
