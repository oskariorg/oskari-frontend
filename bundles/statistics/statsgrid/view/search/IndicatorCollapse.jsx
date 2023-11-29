import React from 'react';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { IndicatorRow } from './IndicatorRow';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    margin-top: 20px;
`;

export const IndicatorCollapse = ({ indicators = [], controller }) => {
    return (
        <StyledCollapse>
            <CollapsePanel
                header={<Message messageKey='indicatorList.title' />}
            >
                { !indicators.length && (<Message messageKey='indicatorList.emptyMsg' />) }
                {
                    indicators.map((indicator) => (
                        <IndicatorRow key={indicator.hash} indicator={indicator} controller={controller} />
                    ))
                }
            </CollapsePanel>
        </StyledCollapse>
    );
};
