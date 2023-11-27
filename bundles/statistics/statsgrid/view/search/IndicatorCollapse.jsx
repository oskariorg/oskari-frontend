import React from 'react';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { IndicatorRow } from './IndicatorRow';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    margin-top: 20px;
`;

export const IndicatorCollapse = ({ state, controller }) => {
    return (
        <StyledCollapse>
            <CollapsePanel
                header={<Message messageKey='indicatorList.title' />}
            >
                {state.indicators?.length < 1 ? (
                    <Message messageKey='indicatorList.emptyMsg' />
                ) : (
                    state.indicators?.map((indicator, index) => (
                        <IndicatorRow key={indicator.indicator || `indicator_${index}`} indicator={indicator} controller={controller} />
                    ))
                )}
            </CollapsePanel>
        </StyledCollapse>
    );
};
