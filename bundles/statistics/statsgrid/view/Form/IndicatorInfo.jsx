import React from 'react';
import { TextInput, TextAreaInput } from 'oskari-ui';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const StyledInput = styled(TextInput)`
    margin-bottom: 10px;
`;
const StyledTextArea = styled(TextAreaInput)`
    margin-bottom: 10px;
`;

export const IndicatorInfo = ({ state, controller }) => {
    return (
        <Content>
            <StyledInput
                placeholder={Oskari.getMsg('StatsGrid', 'userIndicators.panelGeneric.formName')}
                value={state.indicatorName}
                onChange={(e) => controller.setIndicatorName(e.target.value)}
            />
            <StyledTextArea
                placeholder={Oskari.getMsg('StatsGrid', 'userIndicators.panelGeneric.formDescription')}
                rows={2}
                value={state.indicatorDescription}
                onChange={(e) => controller.setIndicatorDescription(e.target.value)}
            />
            <StyledInput
                placeholder={Oskari.getMsg('StatsGrid', 'userIndicators.panelGeneric.formDatasource')}
                value={state.indicatorDatasource}
                onChange={(e) => controller.setIndicatorDatasource(e.target.value)}
            />
        </Content>
    );
};
