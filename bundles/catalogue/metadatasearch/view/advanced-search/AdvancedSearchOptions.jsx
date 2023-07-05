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
import { ADVANCED_SEARCH_PARAMS } from '../../MetadataStateHandler';

const FlexColumnContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions, advancedSearchValues, controller } = props;
    return <FlexColumnContainer>
        <AdvancedSearchResourceType options={getByField(ADVANCED_SEARCH_PARAMS.resourceType, advancedSearchOptions)} selected={advancedSearchValues.resourceType} onChange={controller.advancedSearchResourceTypeChanged}/>
        <AdvancedSearchResourceName options={getByField(ADVANCED_SEARCH_PARAMS.resourceName, advancedSearchOptions)} selected={advancedSearchValues.resourceName} onChange={controller.advancedSearchResourceNameChanged}/>
        <AdvancedSearchResponsibleParty options={getByField(ADVANCED_SEARCH_PARAMS.responsibleParty, advancedSearchOptions)} selected={advancedSearchValues.responsibleParty} onChange={controller.advancedSearchResponsiblePartyChanged}/>
        <AdvancedSearchKeyword options={getByField(ADVANCED_SEARCH_PARAMS.keyword, advancedSearchOptions)} selected={advancedSearchValues.keyword} onChange={controller.advancedSearchKeywordChanged}/>
        <AdvancedSearchTopicCategory options={getByField(ADVANCED_SEARCH_PARAMS.topicCategory, advancedSearchOptions)} selected={advancedSearchValues.topicCategory} onChange={controller.advancedSearchTopicCategoryChanged}/>
        <AdvancedSearchMetadataLanguage options={getByField(ADVANCED_SEARCH_PARAMS.metadataLanguage, advancedSearchOptions)} selected={advancedSearchValues.metadataLanguage} onChange={controller.advancedSearchMetadataLanguageChanged}/>
        <AdvancedSearchResourceLanguage options={getByField(ADVANCED_SEARCH_PARAMS.resourceLanguage, advancedSearchOptions)} selected={advancedSearchValues.resourceLanguage} onChange={controller.advancedSearchResourceLanguageChanged}/>
    </FlexColumnContainer>;
};

const getByField = (fieldName, optionsArray) => {
    return optionsArray?.fields?.find((item) => item.field === fieldName) || null;
};

AdvancedSearchOptions.propTypes = {
    advancedSearchOptions: PropTypes.object,
    advancedSearchValues: PropTypes.object,
    controller: PropTypes.object
};
