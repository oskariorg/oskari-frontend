import React, { Fragment } from 'react';
import { Collapse } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import 'antd/es/collapse/style/index.js';

const { Panel } = Collapse;

const composeLegendImage = (imageURL) => {
    return <img src={ imageURL } />;
};

const composeHeader = (title, uuid, callback) => {
    return (
        <Fragment>
            { title }
            { uuid &&
                <InfoCircleOutlined onClick={ (event) => callback(event, uuid) } />
            }
        </Fragment>
    );
};

export const MapLegendList = ({ list }) => {
    return (
        <Collapse>
            { list.map((item) => (
                <Panel key={ item.title } header={ composeHeader(item.title, item.uuid, item.showMetadataCallback) }>
                    <p>{ item.title }</p>
                    { composeLegendImage(item.legendImageURL) }
                </Panel>
            )) }
        </Collapse>
    );
};