import React from 'react';
import { AdvancedSearchCheckboxGroupContainer, AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { Checkbox } from 'oskari-ui';
import PropTypes from 'prop-types';

export const AdvancedSearchResourceType = (props) => {
    const { options } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.resourceType')}</AdvancedSearchInputLabel>
        { hasOptions &&
            <AdvancedSearchCheckboxGroupContainer>
                {options.values.map(value => <Checkbox key={value.val}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.resourceTypes.' + value.val)}</Checkbox>)}
            </AdvancedSearchCheckboxGroupContainer>
        }
    </AdvancedSearchRowContainer>;
};

AdvancedSearchResourceType.propTypes = {
    options: PropTypes.object
};
