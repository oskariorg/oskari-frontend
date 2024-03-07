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

const TimeSeriesParams = ({id, options, selectedValues, controller}) => (
    <Timeseries>
        <TimeseriesField>
            <b><Message messageKey='parameters.from' /></b>
            <StyledSelect
                options={options}
                value={selectedValues[0]}
                onChange={(value) => controller.setParamSelection(id, [value, selectedValues[1]])}
            />
        </TimeseriesField>
        <TimeseriesField>
            <b><Message messageKey='parameters.to' /></b>
            <StyledSelect
                options={options}
                value={selectedValues[1]}
                onChange={(value) => controller.setParamSelection(id, [selectedValues[0], value])}
            />
        </TimeseriesField>
    </Timeseries>
);

export const IndicatorParams = ({ state, allRegionsets, controller }) => {
    const { searchTimeseries, regionsetFilter, indicatorParams, selectedRegionset } = state;
    const { selectors = [], regionsets = [], selections = {} } = indicatorParams;
    if (!selectors.length) {
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
            {selectors.map(({values, time, id, label}) => {
                const value = selections[id];
                if (time && searchTimeseries) {
                    return (
                        <TimeSeriesParams key={id}
                            controller={controller}
                            id={id}
                            options={values}
                            selectedValues={value} />
                    );
                }
                return (
                    <Field key={id}>
                        <b>{label}</b>
                        <StyledSelect
                            options={values}
                            value={value}
                            onChange={(value) => controller.setParamSelection(id, value)}
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
