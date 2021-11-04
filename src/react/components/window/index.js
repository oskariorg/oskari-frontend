import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Flyout } from './Flyout';

const createTmpContainer = () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    element.classList.add('oskari-react-tmp-container');
    return element;
};

/**
 * Opens a modal window for editing my places layer name and style.
 *
 * @param {String} name layer name for editing
 * @param {Object} style Oskari style object for editing
 * @param {Function} saveLayer callback to call when user hits "Save"
 */
export const showPopup = (title, content) => {
    const element = createTmpContainer();

    const removeModal = () => {
        unmountComponentAtNode(element);
        document.body.removeChild(element);
    };

    ReactDOM.render(<Window title={title} onClose={removeModal}>
        {content}
    </Window>,element);
};

/**
 * Opens a an Oskari flyout type of window.
 * Usage:
 * 
 *       let closeFn = null;
 *       btn.on('click', (event) => {
 *           if (closeFn) {
 *               closeFn();
 *               closeFn = null;
 *               return;
 *           }
 *           closeFn = showFlyout('Title', 'Content', () => {
 *               // closed -> cleanup
 *               closeFn = null;
 *           });
 *       });
 *
 * @param {String} title title for flyout
 * @param {String|ReactElement} content content for flyout
 * @param {Function} onClose callback that is called when the window closes
 * @returns function that can be used to close the flyout
 */
export const showFlyout = (title, content, onClose) => {
    const element = createTmpContainer();
    let isStillOnDOM = true;
    const removeWindow = () => {
        if (!isStillOnDOM) {
            return;
        }
        unmountComponentAtNode(element);
        document.body.removeChild(element);
        isStillOnDOM = false;
        if(typeof onClose === 'function') {
            onClose();
        }
    };

    ReactDOM.render(<Flyout title={title} onClose={removeWindow}>
        {content}
    </Flyout>, element);
    return removeWindow;
};
