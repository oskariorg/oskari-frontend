import React from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox } from 'oskari-ui';

export const GetInfoToolComponent = ({ state, controller }) => {
    const { noUI } = state;
    return (
        <Checkbox checked={noUI} onChange={ evt => controller.setNoUI(evt.target.checked) }>
            <Message bundleKey={'Publisher2'} messageKey={'BasicView.noUI'}/>
        </Checkbox>
    );
};

GetInfoToolComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
