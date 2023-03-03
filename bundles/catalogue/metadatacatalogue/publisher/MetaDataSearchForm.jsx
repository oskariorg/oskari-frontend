import React from 'react';
import styled from 'styled-components';
import { Checkbox, Message } from 'oskari-ui';

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export const MetadataSearchForm = ({ state, controller }) => {
    return (
        <StyledCheckbox
            checked={state.allowMetadata}
            onChange={(e) => controller.setAllowMetadata(e.target.checked)}
        >
            <Message bundleKey='catalogue.bundle.metadatacatalogue' messageKey='tool.label' />
        </StyledCheckbox>
    );
};
