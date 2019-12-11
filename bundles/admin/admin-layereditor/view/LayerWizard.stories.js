import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerWizard } from './LayerWizard';
import { AdminLayerFormService } from './AdminLayerFormService';
import { LocaleContext, MutatorContext } from 'oskari-ui/util';
import '../../../../src/global';
import '../resources/locale/fi';
import '../resources/locale/sv';
import '../resources/locale/en';

const Oskari = window.Oskari;
const service = new AdminLayerFormService(() => console.log('State update'));
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
const layerTypes = service.getLayerTypes();
const capabilities = service.getCapabilities();

// const sandbox = Oskari.getSandbox();
storiesOf('LayerWizard', module)
    .add('Initial view', () => {
        Oskari.setLang('en');
        return (
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={service.getLayer()}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                            Not shown
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
    })
    .add('Initial view sv', () => {
        Oskari.setLang('sv');
        return (
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={service.getLayer()}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                            Not shown
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
    })
    .add('Initial view fi', () => {
        Oskari.setLang('fi');
        return (
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={service.getLayer()}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                            Not shown
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
    })
    .add('Type selected', () => {
        Oskari.setLang('en');
        const layer = {
            ...service.getLayer(),
            type: 'wfslayer'
        };
        return (
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={layer}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                            Not shown
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
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
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={layer}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                            Not shown
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
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
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={layer}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                        Layer: {JSON.stringify(layer)}
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
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
            <LocaleContext.Provider value={localeProviderOptions}>
                <MutatorContext.Provider value={service}>
                    <LayerWizard
                        layer={layer}
                        capabilities={capabilities}
                        layerTypes={layerTypes}>
                        Layer: {JSON.stringify(layer)}
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>);
    });
