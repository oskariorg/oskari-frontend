import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel } from 'oskari-ui';
import { LegendImage } from './LegendImage';
import { MetadataIcon } from 'oskari-ui/components/icons';


export const MapLegendList = ({ legendList }) => {
    const composeHeader = (title, uuid) => {
        return (
            <Fragment>
                { title }
                <MetadataIcon metadataId={uuid} style={{ margin: '0 0 0 10px' }} />
            </Fragment>
        );
    };

    return (
        <Collapse>
            { legendList.length > 0 && legendList.map((item) => {
                return (
                    <CollapsePanel key={ item.title } header={ composeHeader(item.title, item.uuid) }>
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
