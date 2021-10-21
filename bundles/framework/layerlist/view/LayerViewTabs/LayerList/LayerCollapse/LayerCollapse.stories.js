import React from 'react';
import { storiesOf } from '@storybook/react';
import { initServices, getBundleInstance } from '../../test.util';
import { LayerCollapse, LayerCollapseHandler } from '.';
import { LocaleProvider } from 'oskari-ui/util';
import { LayerGroup } from '../../../../model/LayerGroup.class';
import '../../../../../../../src/global';
import '../../../../../../mapping/mapmodule/domain/AbstractLayer';

initServices();

const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');
const instance = getBundleInstance();

let lyrCount = 0;
const createLayer = (name, type) => {
    const layer = new AbstractLayer();
    lyrCount++;
    layer._name = name;
    layer.setType(type);
    layer.setId(lyrCount);
    return layer;
};

const createLayers = () => {
    wms = createLayer('WMS layer', 'wmslayer');
    const layers = [
        wms,
        createLayer('WFS layer', 'wfs'),
        createLayer('WMTS layer', 'wmtslayer')
    ];
    return layers;
};

const createLayerGroups = layers => {
    const groups = [
        new LayerGroup('Background layers'),
        new LayerGroup('Data layers'),
        new LayerGroup('User layers')
    ];
    groups.forEach((group, index) => {
        if (index % 2 === 0) {
            group.addLayer(layers[1]);
        }
        if (index % 3 === 0) {
            group.addLayer(layers[2]);
        }
        group.addLayer(layers[0]);
    });
    return groups;
};

const handler = new LayerCollapseHandler(instance);
let groups = [];
let layers = [];
let wms = null;

const resetStoryState = () => {
    layers = createLayers();
    groups = createLayerGroups(layers);
    handler.setState({
        groups,
        selectedLayerIds: [],
        openGroupTitles: []
    });
};

const render = () => (
    <LocaleProvider value={{ bundleKey: instance.getName() }}>
        <LayerCollapse {...handler.getState()} controller={handler.getController()} />
    </LocaleProvider>
);

storiesOf('LayerCollapse', module)

    .add('empty', () => {
        resetStoryState();
        handler.updateState({
            groups: []
        });
        return render();
    })
    .add('with groups', () => {
        resetStoryState();
        return render();
    })
    .add('WMS selected', () => {
        resetStoryState();
        handler.updateState({
            selectedLayerIds: [wms.getId()],
            openGroupTitles: groups.map(cur => cur.getTitle())
        });
        return render();
    })
    .add('Sticky WMS', () => {
        resetStoryState();
        handler.updateState({
            selectedLayerIds: [wms.getId()],
            openGroupTitles: groups.map(cur => cur.getTitle())
        });
        wms.setSticky(true);
        return render();
    });
