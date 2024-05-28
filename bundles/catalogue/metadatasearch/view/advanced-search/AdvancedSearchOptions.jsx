import React from 'react';
import PropTypes from 'prop-types';
import { AdvancedSearchDropdown } from './AdvancedSearchDropdown';
import { FlexColumnContainer } from './AdvancedSearchStyledComponents';
import { AdvancedSearchMulti } from './AdvancedSearchMulti';
import { AdvancedSearchCoverage } from './AdvancedSearchCoverage';

const COVERAGE_FIELD_NAME = 'coverage';

const showField = ({ field, shownIf }, advancedSearchValues) => {
    if (field === COVERAGE_FIELD_NAME) {
        // coverage should be rendered separately
        return false;
    }
    if (!Array.isArray(shownIf)) {
        return true;
    }
    // e.g. [{type:'service}]
    return shownIf.some(obj => {
        return Object.keys(obj).some(key => {
            const selected = advancedSearchValues[key];
            const value = obj[key];
            return Array.isArray(selected) ? selected.includes(value) : selected === value;
        });
    });
};

export const AdvancedSearchOptions = (props) => {
    const { advancedSearchOptions, advancedSearchValues, drawing, controller } = props;
    const { fields = [] } = advancedSearchOptions || {};
    const hasCoverage = fields.some(({ field }) => field === COVERAGE_FIELD_NAME);
    const fieldOptions = fields.filter(f => showField(f, advancedSearchValues));

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
