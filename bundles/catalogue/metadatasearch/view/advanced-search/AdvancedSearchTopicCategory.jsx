import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer, AdvancedSearchSelect } from './AdvancedSearchStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import PropTypes from 'prop-types';
import { Option } from 'oskari-ui';

export const AdvancedSearchTopicCategory = (props) => {
    const { options } = props;
    const hasOptions = options && options?.values?.length && options.values.length > 0;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.topicCategory')}</AdvancedSearchInputLabel>
        <AdvancedSearchSelect>
            { hasOptions && options.values.map(value => <Option key={value.val}>{value.val}</Option>) }
        </AdvancedSearchSelect>
    </AdvancedSearchRowContainer>;
};

AdvancedSearchTopicCategory.propTypes = {
    options: PropTypes.object
};
