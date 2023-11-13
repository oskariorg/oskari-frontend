import React from 'react';
import { Message, Tooltip, WarningIcon } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    word-break: break-all;
`;
const Actions = styled('div')`
    display: flex;
    flex-direction: row;
    margin-left: 10px;
`;
const RemoveButton = styled(IconButton)`
    margin-right: 10px;
`;
const StyledWarningIcon = styled(WarningIcon)`
    margin-left: 10px;
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

export const IndicatorRow = ({ indicator, controller }) => {
    const actions = (
        <Actions>
            <RemoveButton
                type='delete'
                onClick={() => controller.removeIndicator(indicator)}
            />
            <IconButton
                icon={<InfoCircleOutlined />}
                onClick={() => controller.openMetadataPopup(indicator)}
            />
        </Actions>
    );

    if (!indicator.labels?.full || indicator.labels?.full === '') {
        return (
            <Row>
                <span><Message messageKey='missing.indicator' /><StyledWarningIcon /></span>
                {actions}
            </Row>
        );
    }

    return (
        <Row>
            <Tooltip title={indicator.labels?.full}>
                <span>{getIndicatorText(indicator.labels)}</span>
            </Tooltip>
            {actions}
        </Row>
    );
};
