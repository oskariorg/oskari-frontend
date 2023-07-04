import React from 'react';
import { Option } from 'oskari-ui';
import PropTypes from 'prop-types';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer, AdvancedSearchSelect } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';

export const AdvancedSearchResourceName = (props) => {
    const { options } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.resourceName')}</AdvancedSearchInputLabel>
        <AdvancedSearchSelect>
            { hasOptions && options.values.map(value => <Option key={value.val}>{value.val}</Option>) }
        </AdvancedSearchSelect>
    </AdvancedSearchRowContainer>;
};

AdvancedSearchResourceName.propTypes = {
    options: PropTypes.object
};
