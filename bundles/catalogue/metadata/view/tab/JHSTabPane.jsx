import React from 'react';
import PropTypes from 'prop-types';
import { Title, LabeledItem, Images, Content } from './';

export const JHSTabPane = ({ metadata, identification, showFullGraphics, controller }) => {
    return (
        <Content>
            <Images source={identification.browseGraphics} fullSize={showFullGraphics} toggle={controller.toggleShowFullGraphics}/>
            <Title content={identification.citation?.title} />
            <LabeledItem labelKey={identification.type === 'data' ? 'abstractTextData' : 'abstractTextService'} dataKey='abstractText' source={identification}/>
            <LabeledItem dataKey='metadataDateStamp' source={metadata} />
            <LabeledItem dataKey='onlineResources' source={metadata} renderList/>
            <LabeledItem dataKey='languages' source={identification} renderList/>
            <LabeledItem dataKey='topicCategories' source={identification} renderList/>
            <LabeledItem dataKey='temporalExtents' source={identification} renderList/>
            <LabeledItem dataKey='lineageStatements' source={metadata} />
            <LabeledItem dataKey='spatialResolutions' source={identification} renderList/>
            <LabeledItem dataKey='responsibleParties' source={identification} renderList/>
            <LabeledItem dataKey='date' source={identification.citation}/>
            <LabeledItem dataKey='distributionFormats' source={metadata} renderList/>
            <LabeledItem dataKey='spatialRepresentationTypes' source={identification} renderList/>
            <LabeledItem dataKey='fileIdentifier' source={metadata}/>
            <LabeledItem dataKey='metadataStandardName' source={metadata} />
            <LabeledItem dataKey='metadataStandardVersion' source={metadata}/>
            <LabeledItem dataKey='metadataLanguage' source={metadata}/>
            <LabeledItem dataKey='metadataCharacterSet' source={metadata}/>
            <LabeledItem dataKey='metadataResponsibleParties' source={metadata} renderList/>
        </Content>
    );
};

JHSTabPane.propTypes = {
    metadata: PropTypes.object.isRequired,
    identification: PropTypes.object.isRequired,
    showFullGraphics: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
