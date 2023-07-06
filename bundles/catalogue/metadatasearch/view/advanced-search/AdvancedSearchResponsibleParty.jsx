import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer, AdvancedSearchSelect } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { Option } from 'oskari-ui';
import { AdvancedSearchDropdownCommonPropTypes } from './commonPropTypes';

export const AdvancedSearchResponsibleParty = (props) => {
    const { options, onChange, selected } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.organisationName')}</AdvancedSearchInputLabel>
        <AdvancedSearchSelect onChange={onChange} selected={selected}>
            { hasOptions && options.values.map(value => <Option key={value.val} value={value.value}>{value.val}</Option>) }
        </AdvancedSearchSelect>
    </AdvancedSearchRowContainer>;
};

AdvancedSearchResponsibleParty.propTypes = AdvancedSearchDropdownCommonPropTypes;
