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

export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions } = props;
    return <FlexColumnContainer>
        <AdvancedSearchResourceType options={getByField('type', advancedSearchOptions)}/>
        <AdvancedSearchResourceName/>
        <AdvancedSearchResponsibleParty/>
        <AdvancedSearchKeyword/>
        <AdvancedSearchTopicCategory/>
        <AdvancedSearchMetadataLanguage/>
        <AdvancedSearchResourceLanguage/>
    </FlexColumnContainer>;
};

const getByField = (fieldName, optionsArray) => {
    return optionsArray?.fields?.find((item) => item.field === fieldName) || null;
};

AdvancedSearchOptions.propTypes = {
    advancedSearchOptions: PropTypes.object
};
