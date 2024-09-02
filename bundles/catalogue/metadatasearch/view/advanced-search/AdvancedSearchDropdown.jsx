import React from 'react';
import { Message } from 'oskari-ui';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer, AdvancedSearchSelect } from './AdvancedSearchStyledComponents';
import PropTypes from 'prop-types';

export const AdvancedSearchDropdown = (props) => {
    const { field, options, onChange, selected = '', disabled } = props;
    if (!options.length) {
        return null;
    }
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>
            <Message messageKey={`advancedSearch.${field}`} defaultMsg={field}/>
        </AdvancedSearchInputLabel>
        <AdvancedSearchSelect onChange={onChange} value={selected} disabled={disabled} options={options} />
    </AdvancedSearchRowContainer>;
};

AdvancedSearchDropdown.propTypes = {
    field: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string,
    disabled: PropTypes.bool
};
