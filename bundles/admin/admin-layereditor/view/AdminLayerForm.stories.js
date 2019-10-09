import React from 'react';
import { storiesOf } from '@storybook/react';
import { AdminLayerForm } from './AdminLayerForm';
import { AdminLayerFormService } from './AdminLayerFormService';

import '../../../../src/global';
import '../../../mapping/mapmodule/service/map.state';
import '../../../mapping/mapmodule/domain/AbstractLayer';
import '../../../mapping/mapmodule/domain/style';
import '../resources/locale/fi';

import { LocaleContext, MutatorContext } from 'oskari-ui/util';

const Oskari = window.Oskari;
const sandbox = Oskari.getSandbox();
const stateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
sandbox.registerService(stateService);

const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');
const loc = Oskari.getMsg.bind(null, 'admin-layereditor');

const layer = new AbstractLayer();
layer.setAdmin({});
layer.setGroups([]);

const service = new AdminLayerFormService();
service.initLayerState(layer);

storiesOf('AdminLayerForm', module)
    .add('layout', () => (
        <LocaleContext.Provider value={loc}>
            <MutatorContext.Provider value={service}>
                <AdminLayerForm
                    mapLayerGroups={[]}
                    dataProviders={[]}
                    layer={service.getLayer()}
                    messages={service.getMessages()}
                    onDelete={() => {}}
                    onSave={() => {}}
                    onCancel={() => {}} />
            </MutatorContext.Provider>
        </LocaleContext.Provider>
    ));
