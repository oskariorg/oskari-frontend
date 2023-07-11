import React from 'react';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { AdvancedSearchDropdown } from './AdvancedSearchDropdown';
import { FlexColumnContainer } from './AdvancedSearchStyledComponents';
import { AdvancedSearchMulti } from './AdvancedSearchMulti';

export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions, advancedSearchValues, controller } = props;
    return <FlexColumnContainer>
        { advancedSearchOptions &&
            // coverage should be rendered separately
            advancedSearchOptions?.fields?.filter((field) => !field.field !== 'coverage').map((field) => {
                if (field.multi) {
                    return <AdvancedSearchMulti
                        key={field.field}
                        title={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.' + field.field)}
                        options={getByField(field.field, advancedSearchOptions)}
                        selected={advancedSearchValues[field.field]}
                        onChange={(value) => controller.advancedSearchParamsChangedMulti(field.field, value)}/>;
                }

                return <AdvancedSearchDropdown
                    key={field.field}
                    title={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.' + field.field)}
                    options={getByField(field.field, advancedSearchOptions)}
                    selected={advancedSearchValues[field.field]}
                    onChange={(value) => controller.advancedSearchParamsChanged(field.field, value)}/>;
            })
        }
    </FlexColumnContainer>;
};

const getByField = (fieldName, optionsArray) => {
    return optionsArray?.fields?.find((item) => item.field === fieldName) || null;
};

AdvancedSearchOptions.propTypes = {
    advancedSearchOptions: PropTypes.object,
    advancedSearchValues: PropTypes.object,
    controller: PropTypes.object
};
