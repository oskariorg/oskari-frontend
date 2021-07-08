import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import 'antd/es/collapse/style/index.js';

const { Panel } = Collapse;

const MetadataIcon = styled(InfoCircleOutlined)`
    & {
        margin: 0 0 0 10px;
    }
`;

const composeLegendImage = (imageURL) => {
    return <img src={ imageURL } />;
};

const composeHeader = (title, uuid, callback) => {
    return (
        <Fragment>
            { title }
            { uuid &&
                <MetadataIcon onClick={ (event) => callback(event, uuid) } />
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

MapLegendList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired
};
