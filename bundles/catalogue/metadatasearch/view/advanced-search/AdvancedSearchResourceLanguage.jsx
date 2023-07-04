import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer, AdvancedSearchSelect } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import PropTypes from 'prop-types';
import { Option } from 'oskari-ui';

export const AdvancedSearchResourceLanguage = (props) => {
    const { options, onChange, selected } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.resourceLanguage')}</AdvancedSearchInputLabel>
        <AdvancedSearchSelect onChange={onChange} selected={selected}>
            { hasOptions && options.values.map(value => <Option key={value.val}>{value.val}</Option>) }
        </AdvancedSearchSelect>
    </AdvancedSearchRowContainer>;
};

AdvancedSearchResourceLanguage.propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func,
    selected: PropTypes.string
};
