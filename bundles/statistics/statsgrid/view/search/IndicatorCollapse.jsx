import React from 'react';
import { Message, Collapse, CollapsePanel, Tooltip } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    margin-top: 20px;
`;
const Row = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const Actions = styled('div')`
    display: flex;
    flex-direction: row;
`;

const getIndicatorText = (labels) => {
    const { indicator, params, full } = labels;
    let cutLength = 60;
    let minLength = 20;
    const dots = '... ';
    if (indicator && full.length > cutLength) {
        if (params) {
            cutLength = cutLength - dots.length - params.length;
            return indicator.substring(0, Math.max(minLength, cutLength)) + dots + params;
        } else {
            cutLength = cutLength - dots.length;
            return indicator.substring(0, cutLength) + dots;
        }
    } else {
        return full;
    }
};

export const IndicatorCollapse = ({ state, controller }) => {
    return (
        <StyledCollapse>
            <CollapsePanel
                header={<Message messageKey='indicatorList.title' />}
            >
                {state.indicators?.length < 1 ? (
                    <Message messageKey='indicatorList.emptyMsg' />
                ) : (
                    state.indicators.map(indicator => {
                        return (
                            <Row key={indicator.indicator}>
                                <Tooltip title={indicator.labels?.full}>
                                    <span>{getIndicatorText(indicator.labels)}</span>
                                </Tooltip>
                                <Actions>
                                    <IconButton
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => controller.removeIndicator(indicator)}
                                    />
                                    <IconButton
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => controller.openMetadataPopup(indicator)}
                                    />
                                </Actions>
                            </Row>
                        );
                    })
                )}
            </CollapsePanel>
        </StyledCollapse>
    );
};
