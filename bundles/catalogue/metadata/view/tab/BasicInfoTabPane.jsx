import React from 'react';
import PropTypes from 'prop-types';
import { Title, LabeledItem, Images, Content } from '.';

export const BasicInfoTabPane = ({ metadata, identification, showFullGraphics, controller }) => {
    return (
        <Content>
            <Images source={identification.browseGraphics} fullSize={showFullGraphics} toggle={controller.toggleShowFullGraphics}/>
            <Title content={identification.citation?.title} />
            <LabeledItem labelKey={identification.type === 'data' ? 'abstractTextData' : 'abstractTextService'} dataKey='abstractText' source={identification}/>
            <LabeledItem dataKey='metadataDateStamp' source={metadata} />
        </Content>
    );
};

BasicInfoTabPane.propTypes = {
    metadata: PropTypes.object.isRequired,
    identification: PropTypes.object.isRequired,
    showFullGraphics: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
