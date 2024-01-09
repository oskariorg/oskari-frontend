import React from 'react';
import PropTypes from 'prop-types';
import { MetadataContent } from './MetadataContent';
import { Collapse, CollapsePanel, Message } from 'oskari-ui';

export const MetadataCollapse = ({ data = [] }) => {
    if (!data.length) {
        return (<Message messageKey='metadataPopup.noMetadata' messageArgs={{ indicators: 1 }}/>);
    }
    // Description can include HTML so well have to wrap it as HTML content...
    return (
        <Collapse defaultActiveKey={data.map(item => Oskari.getLocalized(item.name))}>
            { data.map(metadata => {
                const name = Oskari.getLocalized(metadata.name) || '';
                if (!name) {
                    return null;
                }
                return (
                    <CollapsePanel header={name} key={name}>
                        <MetadataContent 
                            description={metadata.desc}
                            source={metadata.source}
                            metadata={metadata.metadata}
                        />
                    </CollapsePanel>
                );
            })}
        </Collapse>
    );
};

MetadataCollapse.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.object,
        desc: PropTypes.object,
        source: PropTypes.object,
        metadata: PropTypes.object
      }))
};
