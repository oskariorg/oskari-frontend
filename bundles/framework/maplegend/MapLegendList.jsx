import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'oskari-ui';
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

    const items = legendList.map((item) => {
        return {
            key: item.title,
            label: composeHeader(item.title, item.uuid),
            children: <LegendImage url={ item.legendImageURL } />
        };
    });

    return <Collapse items={items}/>;
};

MapLegendList.propTypes = {
    legendList: PropTypes.arrayOf(PropTypes.object)
};
