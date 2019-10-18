import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerCollapse, CollapseService } from '..';
import { LayerGroup } from '../../../../../../layerselector2/model/LayerGroup.class';
import { AbstractLayer, instance, locale } from './mock';

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

const service = new CollapseService(instance);
let groups = [];
let layers = [];
let wms = null;

const resetStoryState = () => {
    layers = createLayers();
    groups = createLayerGroups(layers);
    service.updateState({
        groups,
        selectedLayerIds: []
    });
};

storiesOf('LayerCollapse', module)

    .add('empty', () => {
        resetStoryState();
        service.updateState({
            groups: []
        });
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('with groups', () => {
        resetStoryState();
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('with filter "wfs"', () => {
        resetStoryState();
        service.updateState({
            filterKeyword: 'wfs'
        });
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('with filter "wms"', () => {
        resetStoryState();
        service.updateState({
            filterKeyword: 'wms'
        });
        return <LayerCollapse {...service.getState()} locale={locale} />;
    })
    .add('WMS selected', () => {
        resetStoryState();
        service.updateState({
            selectedLayerIds: [wms.getId()]
        });
        const state = service.getState();
        state.openGroupTitles = groups.map(cur => cur.getTitle());
        return <LayerCollapse {...state} locale={locale} />;
    })
    .add('Sticky WMS', () => {
        resetStoryState();
        service.updateState({
            selectedLayerIds: [wms.getId()]
        });
        const state = service.getState();
        state.openGroupTitles = groups.map(cur => cur.getTitle());
        wms.setSticky(true);
        return <LayerCollapse {...state} locale={locale} />;
    });
