import React from 'react';
import PropTypes from 'prop-types';
import { MetadataContent } from './MetadataContent';
import { Collapse, CollapsePanel, Message } from 'oskari-ui';
import { getCachedMetadata } from '../../handler/IndicatorHelper';

export const MetadataCollapse = ({ indicators }) => {
    // Only selected indiator (map or search) has button to show popup => metadata is always cached
    const data = indicators.map(ind => getCachedMetadata(ind.ds, ind.id));
    if (!data.length) {
        return (<Message messageKey='metadataPopup.noMetadata' messageArgs={{ indicators: 1 }}/>);
    }
    // Description can include HTML so well have to wrap it as HTML content...
    return (
        <Collapse defaultActiveKey={data.map(item => item.id)}>
            { data.map(({ name, description, source, metadata, id }) => {
                if (!name) {
                    return null;
                }
                return (
                    <CollapsePanel header={name} key={id}>
                        <MetadataContent 
                            description={description}
                            source={source}
                            metadata={metadata}
                        />
                    </CollapsePanel>
                );
            })}
        </Collapse>
    );
};

MetadataCollapse.propTypes = {
    indicators: PropTypes.arrayOf(PropTypes.shape({
        ds: PropTypes.number,
        id: PropTypes.string
      }))
};
