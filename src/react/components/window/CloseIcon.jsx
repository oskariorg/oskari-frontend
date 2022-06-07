import React from 'react';
import PropTypes from 'prop-types';
import { CloseCircleFilled } from '@ant-design/icons';

/**
 * Close icon for popups and flyouts.
 */
// Requires onMouseDown/onTouchStart to be ignored as events as they are listened by the header of the window components.
// Otherwise a draggable operation is started that we DON'T want if the user does mousedown/touchstart ON THE ICON.
// Doing the draggable on mousedown seems to create problems with clickhandler IF the window has been updated AFTER rendering (doing showPopup(title, content).update(newTitle, newContent)).
// For some reason this problem doesn't seem to trigger right after showing/before updating.
export const CloseIcon = ({onClose}) => {
    return (
        <CloseCircleFilled
            className="t_icon t_close"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={onClose}/>);
};

CloseIcon.propTypes = {
    onClose: PropTypes.func.isRequired
};
