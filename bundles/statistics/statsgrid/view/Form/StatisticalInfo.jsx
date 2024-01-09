import React from 'react';
import { TextInput, Select, Button, Message } from 'oskari-ui';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
`;
const StyledSelect = styled(Select)`
    max-width: 200px;
`;
const YearField = styled(TextInput)`
    width: 100px;
`;

export const StatisticalInfo = ({ state, controller }) => {
    return (
        <Content>
            <YearField
                type='number'
                placeholder={Oskari.getMsg('StatsGrid', 'parameters.year')}
                value={state.datasetYear}
                onChange={(e) => controller.setDatasetYear(e.target.value)}
            />
            <StyledSelect
                placeholder={<Message messageKey='panels.newSearch.selectRegionsetPlaceholder' />}
                value={state.datasetRegionset}
                onChange={(value) => controller.setDatasetRegionset(value)}
                options={state.regionsetOptions?.map(rs => ({value: rs.id, label: rs.name}))}
            />
            <Button
                onClick={() => controller.addStatisticalData()}
            >
                <Message messageKey='buttons.add' bundleKey='DivManazer' />
            </Button>
        </Content>
    );
};
