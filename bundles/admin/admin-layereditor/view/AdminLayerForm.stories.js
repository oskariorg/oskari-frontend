import React from 'react';
import { storiesOf } from '@storybook/react';
import { AdminLayerForm } from './AdminLayerForm';
import { AdminLayerFormService } from './AdminLayerFormService';

import '../../../../src/global';
import '../../../mapping/mapmodule/service/map.state';
import '../../../mapping/mapmodule/domain/AbstractLayer';
import '../../../mapping/mapmodule/domain/style';
import '../resources/locale/fi';

import { GenericContext } from 'oskari-ui/util';

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
        <GenericContext.Provider value={{ loc: loc }}>
            <AdminLayerForm
                mutator={service.getMutator()}
                mapLayerGroups={[]}
                dataProviders={[]}
                layer={service.getLayer()}
                message={service.getMessage()}
                onDelete={() => {}}
                onSave={() => {}}
                onCancel={() => {}} />
        </GenericContext.Provider>
    ));
