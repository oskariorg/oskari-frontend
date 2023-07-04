import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AdvancedSearchResourceType } from './AdvancedSearchResourceType';
import { AdvancedSearchResourceName } from './AdvancedSearchResourceName';
import { AdvancedSearchResponsibleParty } from './AdvancedSearchResponsibleParty';
import { AdvancedSearchKeyword } from './AdvancedSearchKeyword';
import { AdvancedSearchTopicCategory } from './AdvancedSearchTopicCategory';
import { AdvancedSearchMetadataLanguage } from './AdvancedSearchMetadataLanguage';
import { AdvancedSearchResourceLanguage } from './AdvancedSearchResourceLanguage';

const FlexColumnContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

const ADVANCED_SEARCH_PARAMS = {
    resourceType: 'type',
    resourceName: 'Title',
    responsibleParty: 'OrganisationName',
    keyword: 'Subject',
    topicCategory: 'TopicCategory',
    metadataLanguage: 'Language',
    resourceLanguage: 'ResourceLanguage'
};

export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions } = props;
    return <FlexColumnContainer>
        <AdvancedSearchResourceType options={getByField(ADVANCED_SEARCH_PARAMS.resourceType, advancedSearchOptions)}/>
        <AdvancedSearchResourceName options={getByField(ADVANCED_SEARCH_PARAMS.resourceName, advancedSearchOptions)}/>
        <AdvancedSearchResponsibleParty options={getByField(ADVANCED_SEARCH_PARAMS.responsibleParty, advancedSearchOptions)}/>
        <AdvancedSearchKeyword options={getByField(ADVANCED_SEARCH_PARAMS.keyword, advancedSearchOptions)}/>
        <AdvancedSearchTopicCategory options={getByField(ADVANCED_SEARCH_PARAMS.topicCategory, advancedSearchOptions)}/>
        <AdvancedSearchMetadataLanguage options={getByField(ADVANCED_SEARCH_PARAMS.metadataLanguage, advancedSearchOptions)}/>
        <AdvancedSearchResourceLanguage options={getByField(ADVANCED_SEARCH_PARAMS.resourceLanguage, advancedSearchOptions)}/>
    </FlexColumnContainer>;
};

const getByField = (fieldName, optionsArray) => {
    return optionsArray?.fields?.find((item) => item.field === fieldName) || null;
};

AdvancedSearchOptions.propTypes = {
    advancedSearchOptions: PropTypes.object
};
