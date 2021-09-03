import React, { Fragment, useState } from 'react';
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

export const MapLegendList = ({ legendList, noImageText }) => {
    const [listState, setListState] = useState({
        list: legendList
    });

    const composeHeader = (title, uuid, callback) => {
        return (
            <Fragment>
                { title }
                { uuid && <MetadataIcon onClick={ (event) => callback(event, uuid) } /> }
            </Fragment>
        );
    };

    const composeLegendImage = (item, index) => {
        return (
            <img
                onError={ () => setListState(listState => {
                    const state = listState;
                    state.list[index].loadError = true;
                    return { ...state };
                }) }
                src={ item.legendImageURL }
            />
        );
    };

    return (
        <Collapse>
            { listState.list.length > 0 && listState.list.map((item, index) => {
                return (
                    <Panel key={ item.title } header={ composeHeader(item.title, item.uuid, item.showMetadataCallback) }>
                        { item.loadError ? noImageText : composeLegendImage(item, index) }
                    </Panel>
                );
            }) }
        </Collapse>
    );
};

MapLegendList.propTypes = {
    legendList: PropTypes.arrayOf(PropTypes.object)
};
