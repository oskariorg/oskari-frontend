import React from 'react';
import { Message, Tooltip, WarningIcon } from 'oskari-ui';
import styled from 'styled-components';

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

export const IndicatorName = ({ indicator }) => {
    if (!indicator.labels?.full || indicator.labels?.full === '') {
        return (
                <span><Message messageKey='missing.indicator' /><StyledWarningIcon /></span>
        );
    }
    return (
        <Tooltip title={indicator.labels?.full}>
            <span>{getIndicatorText(indicator.labels)}</span>
        </Tooltip>
    );
};
