import React from 'react';
import PropTypes from 'prop-types';
import { Title, LabeledItem, Images, Content, DataQualities, ResponsibleParties } from '.';

export const InspireTabPane = ({ metadata, identification, showFullGraphics, controller }) => {
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
            <ResponsibleParties dataKey='responsibleParties' source={identification}/>
            <LabeledItem dataKey='date' source={identification.citation}/>
            <LabeledItem dataKey='scopeCodes' source={metadata} renderList/>
            <LabeledItem dataKey='resourceIdentifiers' source={identification.citation} renderList />
            <LabeledItem dataKey='operatesOn' source={identification} renderList />
            <LabeledItem dataKey='serviceType' source={identification} />
            <LabeledItem dataKey='descriptiveKeywords' source={identification} renderList/>
            <DataQualities content={metadata.dataQualities} />
            <LabeledItem dataKey='accessConstraints' source={identification} renderList/>
            <LabeledItem dataKey='otherConstraints' source={identification}/>
            <LabeledItem dataKey='classifications' source={identification} renderList/>
            <LabeledItem dataKey='useLimitations' source={identification}/>
        </Content>
    );
};

InspireTabPane.propTypes = {
    metadata: PropTypes.object.isRequired,
    identification: PropTypes.object.isRequired,
    showFullGraphics: PropTypes.bool,
    controller: PropTypes.object
};
