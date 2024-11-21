import React from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip, WarningIcon } from 'oskari-ui';
import styled from 'styled-components';

const StyledWarningIcon = styled(WarningIcon)`
    margin-left: 10px;
`;

export const IndicatorName = ({ indicator }) => {
    const { full, short } = indicator.labels || {};
    if (!full) {
        return (
            <span><Message messageKey='missing.indicator' /><StyledWarningIcon /></span>
        );
    }
    if (!short) {
        return (
            <span>{full}</span>
        );
    }
    return (
        <Tooltip title={full}>
            <span>{short}</span>
        </Tooltip>
    );
};
IndicatorName.propTypes = {
    indicator: PropTypes.object.isRequired
};
