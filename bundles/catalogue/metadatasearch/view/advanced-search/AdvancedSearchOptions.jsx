import React from 'react';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { AdvancedSearchDropdown } from './AdvancedSearchDropdown';
import { FlexColumnContainer } from './AdvancedSearchStyledComponents';
import { AdvancedSearchMulti } from './AdvancedSearchMulti';
import { AdvancedSearchCoverage } from './AdvancedSearchCoverage';
const COVERAGE_FIELD_NAME = 'coverage';
export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions, advancedSearchValues, drawing, controller } = props;
    const hasCoverage = advancedSearchOptions?.fields?.find((field) => field.field === COVERAGE_FIELD_NAME) || null;
    return <FlexColumnContainer>
        { advancedSearchOptions &&
            // coverage should be rendered separately
            advancedSearchOptions?.fields?.filter((field) => field.field !== COVERAGE_FIELD_NAME).map((field) => {
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

        {
            hasCoverage &&
            <AdvancedSearchCoverage
                startDrawing={controller.advancedSearchCoverageStartDrawing}
                cancelDrawing={controller.advancedSearchCoverageCancelDrawing}
                drawing={drawing}
                coverageFeature={advancedSearchValues?.coverage}/>
        }
    </FlexColumnContainer>;
};

const getByField = (fieldName, optionsArray) => {
    return optionsArray?.fields?.find((item) => item.field === fieldName) || null;
};

AdvancedSearchOptions.propTypes = {
    advancedSearchOptions: PropTypes.object,
    advancedSearchValues: PropTypes.object,
    drawing: PropTypes.bool,
    controller: PropTypes.object
};
