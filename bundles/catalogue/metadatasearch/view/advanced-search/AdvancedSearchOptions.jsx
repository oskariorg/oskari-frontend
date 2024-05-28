import React from 'react';
import PropTypes from 'prop-types';
import { AdvancedSearchDropdown } from './AdvancedSearchDropdown';
import { FlexColumnContainer } from './AdvancedSearchStyledComponents';
import { AdvancedSearchMulti } from './AdvancedSearchMulti';
import { AdvancedSearchCoverage } from './AdvancedSearchCoverage';

const COVERAGE_FIELD_NAME = 'coverage';

export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions, advancedSearchValues, drawing, controller } = props;
    const { fields = [] } = advancedSearchOptions || {};
    const hasCoverage = fields.some(({ field }) => field === COVERAGE_FIELD_NAME);
    // coverage should be rendered separately
    const fieldOptions = fields.filter(({ field }) => field !== COVERAGE_FIELD_NAME);

    return <FlexColumnContainer>
        {
            fieldOptions.map(({ field, multi, values }) => {
                const Node = multi ? AdvancedSearchMulti : AdvancedSearchDropdown;
                return <Node
                    key={field}
                    field={field}
                    disabled={drawing}
                    options={values}
                    selected={advancedSearchValues[field]}
                    onChange={value => controller.advancedSearchParamsChanged(field, value)}/>;
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

AdvancedSearchOptions.propTypes = {
    advancedSearchOptions: PropTypes.object,
    advancedSearchValues: PropTypes.object,
    drawing: PropTypes.bool,
    controller: PropTypes.object
};
