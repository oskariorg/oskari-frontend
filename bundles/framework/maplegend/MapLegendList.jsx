import React from 'react';
import { Collapse } from 'antd';
import 'antd/es/collapse/style/index.js';

const { Panel } = Collapse;

const createLegendImage = (imageURL) => {
    return <img src={ imageURL } />;
};

export const MapLegendList = ({ list }) => {
    return (
        <Collapse>
            { list.map((item) => (
                <Panel key={ item.title } header={ item.title }>
                    <p>{ item.title }</p>
                    { createLegendImage(item.legendImageURL) }
                </Panel>
            )) }
        </Collapse>
    );
};