import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';

export const AdvancedSearchResponsibleParty = (props) => {
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.organisationName')}</AdvancedSearchInputLabel>
        <input type='text'/>
    </AdvancedSearchRowContainer>;
};
