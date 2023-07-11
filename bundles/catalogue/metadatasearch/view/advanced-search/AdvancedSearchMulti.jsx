import React from 'react';
import { AdvancedSearchCheckboxGroupContainer, AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { PropTypes } from 'prop-types';
import { Checkbox } from 'oskari-ui';

export const AdvancedSearchMulti = (props) => {
    const { title, options, onChange, selected } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{title}</AdvancedSearchInputLabel>
        { hasOptions &&
            <AdvancedSearchCheckboxGroupContainer>
                {options.values.map(value => <Checkbox key={value.val} value={value.val} onChange={onChange} checked={isChecked(selected, value.val)}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.' + value.val)}</Checkbox>)}
            </AdvancedSearchCheckboxGroupContainer>
        }
    </AdvancedSearchRowContainer>;
};

const isChecked = (selected, value) => {
    return selected?.includes(value);
};

AdvancedSearchMulti.propTypes = {
    title: PropTypes.string,
    options: PropTypes.object,
    onChange: PropTypes.func,
    selected: PropTypes.array
};
