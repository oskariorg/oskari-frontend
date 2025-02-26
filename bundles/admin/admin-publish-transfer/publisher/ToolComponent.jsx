import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import { BUNDLE_KEY } from './TransferTool';

export const ToolComponent = ({ controller }) => (
    <Button onClick={() => controller.showPopup() }>
        <Message bundleKey={BUNDLE_KEY} messageKey='openEditor' />
    </Button>
);

ToolComponent.propTypes = {
    controller: PropTypes.object.isRequired
};
