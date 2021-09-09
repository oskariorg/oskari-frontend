import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel } from 'oskari-ui';
import { LegendImage } from './LegendImage';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const MetadataIcon = styled(InfoCircleOutlined)`
    & {
        margin: 0 0 0 10px;
    }
`;

export const MapLegendList = ({ legendList }) => {
    const composeHeader = (title, uuid, callback) => {
        return (
            <Fragment>
                { title }
                { uuid && <MetadataIcon onClick={ (event) => callback(event, uuid) } /> }
            </Fragment>
        );
    };

    return (
        <Collapse>
            { legendList.length > 0 && legendList.map((item) => {
                return (
                    <CollapsePanel key={ item.title } header={ composeHeader(item.title, item.uuid, item.showMetadataCallback) }>
                        <LegendImage url={ item.legendImageURL } />
                    </CollapsePanel>
                );
            }) }
        </Collapse>
    );
};

MapLegendList.propTypes = {
    legendList: PropTypes.arrayOf(PropTypes.object)
};
