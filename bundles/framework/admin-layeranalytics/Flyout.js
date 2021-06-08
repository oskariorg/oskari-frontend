import React from 'react';
import ReactDOM from 'react-dom';
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
            this.container.classList.add('admin-layeranalyitcs');
            this.flyout.addClass('admin-layeranalyitcs');
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
        updateListing: function (shit) {
            ReactDOM.render(<LayerAnalyticsContent analyticsData={[...this.instance.getAnalyticsData()]} />, this.container);
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
