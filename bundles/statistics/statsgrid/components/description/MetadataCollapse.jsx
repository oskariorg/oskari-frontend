import React from 'react';
import PropTypes from 'prop-types';
import { MetadataContent } from './MetadataContent';
import { Collapse, Message } from 'oskari-ui';
import { getCachedMetadata } from '../../handler/IndicatorHelper';

export const MetadataCollapse = ({ indicators }) => {
    // Only selected indiator (map or search) has button to show popup => metadata is always cached
    const data = indicators.map(ind => getCachedMetadata(ind.ds, ind.id)).filter(d => d.name);
    if (!data.length) {
        return (<Message messageKey='metadataPopup.noMetadata' messageArgs={{ indicators: 1 }}/>);
    }
    // Description can include HTML so well have to wrap it as HTML content...
    const items = data.map(({ id, name, ...content }) => ({
        key: id,
        label: name,
        children: <MetadataContent { ...content } />
    }));
    return <Collapse defaultActiveKey={data.map(item => item.id)} items={items} />;
};

MetadataCollapse.propTypes = {
    indicators: PropTypes.arrayOf(PropTypes.shape({
        ds: PropTypes.number,
        id: PropTypes.string
    }))
};
