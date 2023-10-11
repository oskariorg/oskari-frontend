import React from 'react';
import { Select, Message } from 'oskari-ui';
import styled from 'styled-components';

const Field = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    width: 50%;
    margin-right: 10px;
`;
const TimeseriesField = styled('div')`
    display: flex;
    flex-direction: row;
    width: 50%;
`;
const StyledSelect = styled(Select)`
    width: 100%;
`;

export const IndicatorParams = ({ state, controller }) => {

    const paramKeys = Object.keys(state.indicatorParams?.selectors);
    const regionsets = [];
    if (state.indicatorParams?.regionset && state.indicatorParams?.regionset.length > 0) {
        for (const rs of state.indicatorParams.regionset) {
            const rsData = state.regionsetOptions.find(rsd => rsd.id === rs);
            if (rsData) regionsets.push(rsData);
        }
    }

    return (
        <div>
            {paramKeys.map((param) => {
                const selector = state.indicatorParams.selectors[param];
                if (selector?.time) {
                    if (state.searchTimeseries) {
                        const timeOptions = selector?.values?.map(value => ({ value: value.id, label: value.title })); 
                        return (
                            <TimeseriesField key={param}>
                                <Field>
                                    <b><Message messageKey='parameters.from' /></b>
                                    <StyledSelect
                                        options={timeOptions}
                                        value={state.indicatorParams?.selected[param][1]}
                                        onChange={(value) => controller.setParamSelection(param, value, 1)}
                                    />
                                </Field>
                                <Field>
                                    <b><Message messageKey='parameters.to' /></b>
                                    <StyledSelect
                                        options={timeOptions}
                                        value={state.indicatorParams?.selected[param][0]}
                                        onChange={(value) => controller.setParamSelection(param, value, 0)}
                                    />
                                </Field>
                            </TimeseriesField>
                        )
                    }
                }
                return (
                    <Field key={param}>
                        <b><Message messageKey={`parameters.${param}`} /></b>
                        <StyledSelect
                            options={selector?.values?.map(value => ({ value: value.id, label: value.title }))}
                            value={state.indicatorParams?.selected[param]}
                            onChange={(value) => controller.setParamSelection(param, value)}
                        />
                    </Field>
                );
            })}
            {regionsets.length > 0 && (
                <Field>
                    <b><Message messageKey='parameters.regionset' /></b>
                    <StyledSelect
                        options={regionsets.map(rs => ({ value: rs.id, label: rs.name }))}
                        value={state.indicatorParams?.selected.regionsets}
                        onChange={(value) => controller.setParamSelection('regionsets', value)}
                    />
                </Field>
            )}
        </div>
    );
};
