import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerWizard } from './LayerWizard';
import { AdminLayerFormHandler } from './AdminLayerFormHandler';
import { LocaleProvider } from 'oskari-ui/util';
import '../../../../src/global';
import '../resources/locale/fi';
import '../resources/locale/sv';
import '../resources/locale/en';

const Oskari = window.Oskari;
const service = new AdminLayerFormHandler(() => console.log('State update'));
service.initLayerState();
service.capabilities = {
    layers: [{
        name: 'fake',
        locale: {
            en: {
                name: 'Layer name from service'
            }
        }
    }, {
        name: 'it',
        locale: {
            en: {
                name: 'Layer name from service'
            }
        }
    }, {
        name: 'till',
        locale: {
            en: {
                name: 'Layer name from service'
            }
        }
    }, {
        name: 'you',
        locale: {
            en: {
                name: 'Layer name from service'
            }
        }
    }, {
        name: 'make it',
        locale: {
            en: {
                name: 'Layer name from service'
            }
        }
    }],
    existingLayers: {
        'fake': [1]
    },
    layersWithErrors: ['it'],
    capabilitiesFailed: ['you'],
    unsupportedLayers: ['till']
};
const localeProviderOptions = { bundleKey: 'admin-layereditor' };
const layerTypes = ['wfslayer'];
const capabilities = service.getCapabilities();

// const sandbox = Oskari.getSandbox();
storiesOf('LayerWizard', module)
    .add('Initial view', () => {
        Oskari.setLang('en');
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={service.getLayer()}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    controller={service.getController()}>
                        Not shown
                </LayerWizard>
            </LocaleProvider>);
    })
    .add('Initial view sv', () => {
        Oskari.setLang('sv');
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={service.getLayer()}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    controller={service.getController()}>
                        Not shown
                </LayerWizard>
            </LocaleProvider>);
    })
    .add('Initial view fi', () => {
        Oskari.setLang('fi');
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={service.getLayer()}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    controller={service.getController()}>
                        Not shown
                </LayerWizard>
            </LocaleProvider>);
    })
    .add('Type selected', () => {
        Oskari.setLang('en');
        const layer = {
            ...service.getLayer(),
            type: 'wfslayer'
        };
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={layer}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    versions={['1.1.0', '2.0.0']}
                    controller={service.getController()}>
                        Not shown
                </LayerWizard>
            </LocaleProvider>);
    })
    .add('URL and version selected', () => {
        Oskari.setLang('en');
        const layer = {
            ...service.getLayer(),
            type: 'wfslayer',
            url: 'testing.com',
            version: '3.0'
        };
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={layer}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    controller={service.getController()}>
                        Not shown
                </LayerWizard>
            </LocaleProvider>);
    })
    .add('Everything selected', () => {
        Oskari.setLang('en');
        const layer = {
            ...service.getLayer(),
            type: 'wfslayer',
            url: 'testing.com',
            version: '3.0',
            name: 'make it'
        };
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={layer}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    controller={service.getController()}>
                    Layer: {JSON.stringify(layer)}
                </LayerWizard>
            </LocaleProvider>);
    })
    .add('Editing layer', () => {
        Oskari.setLang('en');
        const layer = {
            ...service.getLayer(),
            type: 'wfslayer',
            url: 'testing.com',
            version: '3.0',
            name: 'make it',
            isNew: false
        };
        return (
            <LocaleProvider value={localeProviderOptions}>
                <LayerWizard
                    layer={layer}
                    capabilities={capabilities}
                    layerTypes={layerTypes}
                    controller={service.getController()}>
                    Layer: {JSON.stringify(layer)}
                </LayerWizard>
            </LocaleProvider>);
    });
