import React from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox } from 'oskari-ui';

export const MapRotatorToolComponent = ({ state, controller }) => {
    const { noUI } = state;
    return (
        <Checkbox checked={noUI} onChange={ evt => controller.setNoUI(evt.target.checked) }>
            <Message bundleKey={'maprotator'} messageKey={'display.publisher.noUI'}/>
        </Checkbox>
    );
};

MapRotatorToolComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
