import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';

export const AdvancedSearchTopicCategory = (props) => {
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.topicCategory')}</AdvancedSearchInputLabel>
        <input type='text'/>
    </AdvancedSearchRowContainer>;
};
