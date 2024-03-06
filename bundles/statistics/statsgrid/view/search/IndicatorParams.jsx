import React from 'react';
import { Select, Message } from 'oskari-ui';
import styled from 'styled-components';

const Field = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    width: 180px;
`;
const Timeseries = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`;
const TimeseriesField = styled.div`
    display: flex;
    flex-direction: column;
    width: 100px;
    margin-right: 10px;
`;
const StyledSelect = styled(Select)`
    width: 100%;
`;

const TimeSeriesParams = ({name, options, selectedValues, controller}) => (
    <Timeseries>
        <TimeseriesField>
            <b><Message messageKey='parameters.from' /></b>
            <StyledSelect
                options={options}
                value={selectedValues[0]}
                onChange={(value) => controller.setParamSelection(name, [value, selectedValues[1]])}
            />
        </TimeseriesField>
        <TimeseriesField>
            <b><Message messageKey='parameters.to' /></b>
            <StyledSelect
                options={options}
                value={selectedValues[1]}
                onChange={(value) => controller.setParamSelection(name, [selectedValues[0], value])}
            />
        </TimeseriesField>
    </Timeseries>
);

export const IndicatorParams = ({ state, allRegionsets, controller }) => {
    const { searchTimeseries, regionsetFilter, indicatorParams, selectedRegionset } = state;
    const { selectors = {}, regionsets = [], selections = {} } = indicatorParams;
    const paramKeys = Object.keys(selectors);
    if (!paramKeys.length) {
        return (
            <i><Message messageKey='panels.newSearch.refineSearchTooltip1' /></i>
        );
    }
    const isDisabled = id => regionsetFilter.length && !regionsetFilter.includes(id);
    const regionsetOptions = allRegionsets
        .filter(rs => regionsets.includes(rs.id))
        .map(rs => {
            return {
                value: rs.id,
                label: rs.name,
                disabled: isDisabled(rs.id)
            };
        });

    return (
        <div>
            {paramKeys.map((param) => {
                const value = selections[param];
                const { values = [], time } = selectors[param] || {};
                const options = values.map(value => ({ value: value.id, label: value.title }));
                if (time && searchTimeseries) {
                    return (
                        <TimeSeriesParams key={param}
                            controller={controller}
                            name={param}
                            options={options}
                            selectedValues={value} />
                    );
                }
                return (
                    <Field key={param}>
                        <b><Message messageKey={`parameters.${param}`} defaultMsg={param} /></b>
                        <StyledSelect
                            options={options}
                            value={value}
                            onChange={(value) => controller.setParamSelection(param, value)}
                            mode={time ? 'multiple' : ''}
                        />
                    </Field>
                );
            })}
            <Field>
                <b><Message messageKey='parameters.regionset' /></b>
                <StyledSelect
                    options={regionsetOptions}
                    value={selectedRegionset}
                    onChange={(value) => controller.setSelectedRegionset(value)}
                />
            </Field>
        </div>
    );
};
