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

const TimeSeriesParams = ({fieldName, timeOptions, selectedValues, controller}) => (
    <Timeseries>
        <TimeseriesField>
            <b><Message messageKey='parameters.from' /></b>
            <StyledSelect
                options={timeOptions}
                value={selectedValues[0]}
                onChange={(value) => controller.setParamSelection(fieldName, value, 0)}
            />
        </TimeseriesField>
        <TimeseriesField>
            <b><Message messageKey='parameters.to' /></b>
            <StyledSelect
                options={timeOptions}
                value={selectedValues[1]}
                onChange={(value) => controller.setParamSelection(fieldName, value, 1)}
            />
        </TimeseriesField>
    </Timeseries>
);

export const IndicatorParams = ({ params, allRegionsets = [], searchTimeseries, regionsetFilter, controller }) => {
    const paramKeys = Object.keys(params.selectors);
    const indicatorRegionsets = params.regionset || [];
    const regionsetOptions = allRegionsets
        .filter(rs => indicatorRegionsets.includes(rs.id))
        .map(rs => {
            const opt = { value: rs.id, label: rs.name };
            if (regionsetFilter.length && !regionsetFilter.includes(rs.id)) {
                opt.disabled = true;
            }
            return opt;
        });

    return (
        <div>
            {paramKeys.map((param) => {
                const selector = params.selectors[param];
                if (selector?.time && searchTimeseries) {
                    const timeOptions = selector?.values?.map(value => ({ value: value.id, label: value.title }));
                    return (
                        <TimeSeriesParams key={param}
                            controller={controller}
                            fieldName={param}
                            timeOptions={timeOptions}
                            selectedValues={params.selected[param]} />
                    );
                }
                return (
                    <Field key={param}>
                        <b><Message messageKey={`parameters.${param}`} defaultMsg={param} /></b>
                        <StyledSelect
                            options={selector?.values?.map(value => ({ value: value.id, label: value.title }))}
                            value={params.selected[param]}
                            onChange={(value) => controller.setParamSelection(param, value)}
                            mode={selector?.time === true ? 'multiple' : ''}
                        />
                    </Field>
                );
            })}
            {regionsetOptions.length > 0 && (
                <Field>
                    <b><Message messageKey='parameters.regionset' /></b>
                    <StyledSelect
                        options={regionsetOptions}
                        value={params.selected.regionsets}
                        onChange={(value) => controller.setParamSelection('regionsets', value)}
                    />
                </Field>
            )}
        </div>
    );
};
