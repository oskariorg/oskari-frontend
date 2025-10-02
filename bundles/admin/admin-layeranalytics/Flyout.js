import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { LayerAnalyticsList } from './LayerAnalyticsList';
import { LayerAnalyticsDetails } from './LayerAnalyticsDetails';
import { createRoot } from 'react-dom/client';

Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.Flyout',

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.flyout = null;
        this.selectedLayerId = null;
        this._reactRoot = null;
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

        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        updateUI () {
            this.getReactRoot(this.container).render(
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    { !this.selectedLayerId
                        ? <ThemeProvider>
                            <LayerAnalyticsList
                                analyticsData={[...this.instance.getAnalyticsListData()]}
                                isLoading={ this.instance.getLoadingState() }
                                layerEditorCallback={ this.openLayerEditor }
                                removeAnalyticsCallback={ (id) => this.instance.removeAnalyticsData(id) }
                                layerDetailsCallback={ (id) => this.toggleLayerDetails(id) }
                            />
                        </ThemeProvider>
                        : <LayerAnalyticsDetails
                            layerData={ this.instance.getAnalyticsDetailsData() }
                            isLoading={ this.instance.getLoadingState() }
                            closeDetailsCallback={ () => this.toggleLayerDetails() }
                            removeAnalyticsCallback={ (id, dataId) => this.instance.removeAnalyticsData(id, dataId) }
                        />
                    }
                </LocaleProvider>
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
