import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerCollapse } from '../../LayerCollapse';
import { LayerGroup } from '../../../../layerselector2/model/LayerGroup.class';
import { AbstractLayer } from './AbstractLayer.class';

let lyrCount = 0;
const createLayer = (name, type) => {
    const layer = new AbstractLayer();
    lyrCount++;
    layer._name = name;
    layer.setType(type);
    layer.setId(lyrCount);
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
    groups.forEach((group, index) => {
        if (index % 2 === 0) {
            group.addLayer(wfs);
        }
        if (index % 3 === 0) {
            group.addLayer(wmts);
        }
        group.addLayer(wms);
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
    .add('with filter "wms"', () => {
        const storyProps = {
            ...defaultProps,
            filterKeyword: 'wms'
        };
        return <LayerCollapse {...storyProps} />;
    })
    .add('first selected', () => {
        const storyProps = {
            ...defaultProps,
            selectedLayers: defaultProps.groups[0].getLayers().filter((cur, i) => i === 0)
        };
        return <LayerCollapse {...storyProps} />;
    });
