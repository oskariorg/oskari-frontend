import React from 'react';
import { Message } from 'oskari-ui';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { MapLegendList } from '../components/MapLegendList';

export class MapLegendView {
    constructor (instance) {
        this.instance = instance;
    }

    showMetadataFlyout (event, layerId) {
        event.stopPropagation();
        this.instance.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [{ layerId: layerId }]);
    }

    /**
     * Renders legend images as an accordion for the selected layers.
     */
    getContent () {
        const layers = this.instance.getSandbox().findAllSelectedMapLayers();

        // populate selected layer list
        const showMetadata = (event, layerId) => this.showMetadataFlyout(event, layerId);
        const legends = layers
            .filter(layer => typeof layer.getLegendImage === 'function' && !!layer.getLegendImage())
            .map(layer => {
                const uuid = layer.getMetadataIdentifier();
                const layerId = layer.getId();
                return {
                    title: layer.getName(),
                    uuid,
                    layerId,
                    legendImageURL: layer.getLegendImage(),
                    metadataUrl: layer.getAttributes().metadataUrl,
                    loadError: false,
                    showMetadataCallback: layerId ? showMetadata : null
                };
            }).reverse();

        return (
            <ThemeProvider>
                <LocaleProvider value={{ bundleKey: 'maplegend' }}>
                    { legends.length === 0
                        ? <Message messageKey='noLegendsText' />
                        : <MapLegendList legendList={ legends } />
                    }
                </LocaleProvider>
            </ThemeProvider>
        );
    }
}
