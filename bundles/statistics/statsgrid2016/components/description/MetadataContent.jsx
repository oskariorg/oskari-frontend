import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';

export const MetadataContent = ({description, source, metadata = {}}) => {
    const desc = Oskari.getLocalized(description) || '';
    const datasource = Oskari.getLocalized(source) || '';
    if (!desc) {
        return (<Message messageKey='metadataPopup.noMetadata' messageArgs={{ indicators: 1 }}/>);
    }
    // Description can include HTML so well have to wrap it as HTML content...
    return (<React.Fragment>
        <p dangerouslySetInnerHTML={{__html: desc}} />
        <p>
            <DataLabel labelKey='panels.newSearch.datasourceTitle' value={datasource} />
            <DataLabel labelKey='metadataPopup.updated' value={metadata.updated} />
            <DataLabel labelKey='metadataPopup.nextUpdate' value={metadata.nextUpdate} />
        </p>
    </React.Fragment>);
};

const bTag = styled.b``;
const DataLabel = ({labelKey, value}) => {
    if (typeof value !== 'number' && !value) {
        return null;
    }
    return (
        <React.Fragment>
            <Message LabelComponent={bTag} messageKey={labelKey} />: {value}<br />
        </React.Fragment>);
}

MetadataContent.propTypes = {
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    metadata: PropTypes.object
};
