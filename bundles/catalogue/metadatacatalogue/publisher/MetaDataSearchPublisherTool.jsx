import React from 'react';
import styled from 'styled-components';
import { Checkbox, Message } from 'oskari-ui';

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export const MetadataSearchPublisherTool = ({ state, controller }) => {
    return (
        <StyledCheckbox
            checked={state.allowMetadata}
            onChange={(e) => controller.setAllowMetadata(e.target.checked)}
        >
            <Message bundleKey='Publisher2' messageKey='BasicView.maptools.MetadataSearchTool' />
        </StyledCheckbox>
    );
};
