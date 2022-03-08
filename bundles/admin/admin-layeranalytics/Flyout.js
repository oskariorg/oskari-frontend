import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { LayerAnalyticsList } from './LayerAnalyticsList';
import { LayerAnalyticsDetails } from './LayerAnalyticsDetails';

Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.Flyout',

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.flyout = null;
        this.selectedLayerId = null;
    }, {
        __name: 'Oskari.framework.bundle.admin-layeranalytics.Flyout',
        getName () {
            return this.__name;
        },
        getTitle () {
            return this.instance.getLocalization('flyout').title;
        },
        setEl (el, flyout, width, height) {
            this.container = el[0];
            this.flyout = flyout;
            this.container.classList.add('admin-layeranalytics');
            this.flyout.addClass('admin-layeranalytics');
        },
        /**
         * Renders content for flyout UI
         * @method createContent
         */
        createContent () {
            const root = this.container;
            if (!root) {
                return;
            }

            this.updateUI();
        },
        updateUI () {
            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    { !this.selectedLayerId
                        ? <LayerAnalyticsList
                            analyticsData={[...this.instance.getAnalyticsListData()]}
                            isLoading={ this.instance.getLoadingState() }
                            layerEditorCallback={ this.openLayerEditor }
                            removeAnalyticsCallback={ (id) => this.instance.removeAnalyticsData(id) }
                            layerDetailsCallback={ (id) => this.toggleLayerDetails(id) }
                        />
                        : <LayerAnalyticsDetails
                            layerData={ this.instance.getAnalyticsDetailsData() }
                            isLoading={ this.instance.getLoadingState() }
                            closeDetailsCallback={ () => this.toggleLayerDetails() }
                            removeAnalyticsCallback={ (id, dataId) => this.instance.removeAnalyticsData(id, dataId) }
                        />
                    }
                </LocaleProvider>,
                this.container
            );
        },
        openLayerEditor (id) {
            if (typeof id !== 'undefined') {
                Oskari.getSandbox().postRequestByName('ShowLayerEditorRequest', [id]);
            }
        },
        toggleLayerDetails (selectedId) {
            if (typeof selectedId !== 'undefined') {
                this.selectedLayerId = selectedId;
                this.instance.produceAnalyticsDetailsData(selectedId);
            } else {
                this.selectedLayerId = null;
            }
            this.updateUI();
        },
        getSelectedLayerId () {
            return this.selectedLayerId;
        },
        startPlugin () {}
    }
);
