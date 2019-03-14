import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerCollapse } from '../../LayerCollapse';
import { LayerGroup } from '../../../../layerselector2/model/LayerGroup.class';
import { AbstractLayer } from './AbstractLayer.class';

const createLayer = (name, type) => {
    const layer = new AbstractLayer();
    layer._name = name;
    layer.setType(type);
    return layer;
};

const createLayerGroups = () => {
    const groups = [
        new LayerGroup('Background layers'),
        new LayerGroup('Data layers'),
        new LayerGroup('User layers')
    ];
    const wms = createLayer('WMS layer', 'wmslayer');
    const wfs = createLayer('WFS layer', 'wfs');
    const wmts = createLayer('WMTS layer', 'wmtslayer');
    groups.forEach(group => {
        group.addLayer(wms);
        group.addLayer(wfs);
        group.addLayer(wmts);
    });
    return groups;
};

const defaultProps = {
    groups: createLayerGroups()
};

storiesOf('LayerCollapse', module)

    .add('empty', () => {
        const storyProps = {
            ...defaultProps,
            groups: undefined
        };
        return <LayerCollapse {...storyProps} />;
    })
    .add('with groups', () => {
        const storyProps = {
            ...defaultProps
        };
        return <LayerCollapse {...storyProps} />;
    })
    .add('with filter "Base"', () => {
        const storyProps = {
            ...defaultProps,
            filterKeyword: 'Base'
        };
        return <LayerCollapse {...storyProps} />;
    });
