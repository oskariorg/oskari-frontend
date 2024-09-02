import React from 'react';
import { AdvancedSearchCheckboxGroupContainer, AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';
import { PropTypes } from 'prop-types';
import { Checkbox, Message } from 'oskari-ui';

export const AdvancedSearchMulti = (props) => {
    const { field, options, onChange, selected = [], disabled } = props;
    if (!options.length) {
        return null;
    }
    const onCheckbox = (value, checked) => {
        const values = checked ? [...selected, value] : selected.filter(val => val !== value);
        onChange(values);
    };
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>
            <Message messageKey={`advancedSearch.${field}`} defaultMsg={field}/>
        </AdvancedSearchInputLabel>
        {
            <AdvancedSearchCheckboxGroupContainer>
                {options.map(({ value, label }) =>
                    <Checkbox
                        disabled={disabled}
                        key={value}
                        value={value}
                        onChange={evt => onCheckbox(value, evt.target.checked)}
                        checked={selected.includes(value)}>
                        <Message messageKey={`advancedSearch.${value}`} defaultMsg={label || value}/>
                    </Checkbox>)}
            </AdvancedSearchCheckboxGroupContainer>
        }
    </AdvancedSearchRowContainer>;
};

AdvancedSearchMulti.propTypes = {
    field: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.array,
    disabled: PropTypes.bool
};
