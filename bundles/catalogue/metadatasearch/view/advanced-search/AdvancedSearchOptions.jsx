import React from 'react';
import styled from 'styled-components';
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
    return <FlexColumnContainer>
        <AdvancedSearchResourceType/>
        <AdvancedSearchResourceName/>
        <AdvancedSearchResponsibleParty/>
        <AdvancedSearchKeyword/>
        <AdvancedSearchTopicCategory/>
        <AdvancedSearchMetadataLanguage/>
        <AdvancedSearchResourceLanguage/>
    </FlexColumnContainer>;
};
