import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer, AdvancedSearchSelect } from './AdvancedSearchStyledComponents';
import { Option } from 'oskari-ui';
import PropTypes from 'prop-types';
export const AdvancedSearchDropdown = (props) => {
    const { title, options, onChange, selected } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    if (!hasOptions) {
        return null;
    }
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{title}</AdvancedSearchInputLabel>
        <AdvancedSearchSelect onChange={onChange} value={selected}>
            { options.values.map(value => <Option key={value.val} value={value.value}>{value.val}</Option>) }
        </AdvancedSearchSelect>
    </AdvancedSearchRowContainer>;
};

AdvancedSearchDropdown.propTypes = {
    title: PropTypes.string,
    options: PropTypes.object,
    onChange: PropTypes.func,
    selected: PropTypes.string
};
