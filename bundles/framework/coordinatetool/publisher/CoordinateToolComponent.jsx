import React from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox } from 'oskari-ui';

export const CoordinateToolComponent = ({ state, controller }) => {
    const { noUI, hasSupportedProjections, supportedProjections } = state;
    return <>
        <Checkbox checked={noUI} onChange={ evt => controller.setNoUI(evt.target.checked) }>
            <Message bundleKey={'coordinatetool'} messageKey={'display.publisher.noUI'}/>
        </Checkbox>
        { hasSupportedProjections &&
            <Checkbox checked={supportedProjections} onChange={ evt => controller.setSupportedProjections(evt.target.checked) }>
                <Message bundleKey={'coordinatetool'} messageKey={'display.publisher.showTransformationTools'}/>
            </Checkbox>
        }
    </>;
};

CoordinateToolComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
