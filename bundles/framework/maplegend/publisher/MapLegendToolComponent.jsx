import React from 'react';
import { Message, Checkbox, Tooltip } from 'oskari-ui';
import styled from 'styled-components';

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export const MapLegendTool = ({ state, controller }) => {
    const disabled = state.isDisabled;
    const component = (
        <StyledCheckbox
            checked={state.showLegends}
            onChange={(e) => controller.setShowLegends(e.target.checked)}
            disabled={disabled}
        >
            <Message bundleKey='maplegend' messageKey='tool.label' />
        </StyledCheckbox>
    );

    if (disabled) {
        return (
            <Tooltip title={<Message bundleKey='maplegend' messageKey='noLegendsText' />}>
                {component}
            </Tooltip>
        );
    } else {
        return component;
    }
};
