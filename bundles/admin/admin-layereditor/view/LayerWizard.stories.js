import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerWizard } from './LayerWizard';
import { AdminLayerFormService } from './AdminLayerFormService';
import { LocaleContext, MutatorContext } from 'oskari-ui/util';
import '../../../../src/global';
import '../resources/locale/fi';

const Oskari = window.Oskari;
const service = new AdminLayerFormService(() => console.log('State update'));
service.initLayerState();
service.capabilities = [{
    layerName: 'fake'
}, {
    layerName: 'it'
}, {
    layerName: 'till'
}, {
    layerName: 'you'
}, {
    layerName: 'make it'
}];
const loc = Oskari.getMsg.bind(null, 'admin-layereditor');
const layerTypes = service.getLayerTypes();
const capabilities = service.getCapabilities();

// const sandbox = Oskari.getSandbox();
storiesOf('LayerWizard', module)
    .add('Initial view', () => {
        return (
            <LocaleContext.Provider value={loc}>
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
        const layer = {
            ...service.getLayer(),
            type: 'WFS'
        };
        return (
            <LocaleContext.Provider value={loc}>
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
        const layer = {
            ...service.getLayer(),
            type: 'WFS',
            url: 'testing.com',
            version: '3.0'
        };
        return (
            <LocaleContext.Provider value={loc}>
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
        const layer = {
            ...service.getLayer(),
            type: 'WFS',
            url: 'testing.com',
            version: '3.0',
            layerName: 'make it'
        };
        return (
            <LocaleContext.Provider value={loc}>
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
        const layer = {
            ...service.getLayer(),
            type: 'WFS',
            url: 'testing.com',
            version: '3.0',
            layerName: 'make it',
            isNew: false
        };
        return (
            <LocaleContext.Provider value={loc}>
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
