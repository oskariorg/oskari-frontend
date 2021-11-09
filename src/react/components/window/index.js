import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Flyout } from './Flyout';
import { Popup } from './Popup';

/*
TODOs:
- Some way of triggering re-render for content on a popup? Currently you can just open a new popup with new content but it is centered instead of keeping the previous position.
- Popup size can change if the content is a collapse panel -> opening it makes popup grow -> can be off screen
*/

const createTmpContainer = () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    element.classList.add('oskari-react-tmp-container');
    return element;
};

/**
 * Opens a an Oskari popup type of window.
 * Usage:
 * 
 *       let closeFn = null;
 *       btn.on('click', (event) => {
 *           if (closeFn) {
 *               closeFn();
 *               closeFn = null;
 *               return;
 *           }
 *           closeFn = showPopup('Title', 'Content', () => {
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
export const showPopup = (title, content, onClose) => {
    const element = createTmpContainer();
    let isStillOnDOM = true;
    const removeWindow = () => {
        if (!isStillOnDOM) {
            return;
        }
        unmountComponentAtNode(element);
        document.body.removeChild(element);
        isStillOnDOM = false;
        if (typeof onClose === 'function') {
            onClose();
        }
    };
    const bringToTop = () => document.body.appendChild(element);
    const render = (title, content) => {
        ReactDOM.render(
            <Popup title={title} onClose={removeWindow} bringToTop={bringToTop} opts={{isDraggable: true}}>
                {content}
            </Popup>, element);
    };
    render(title, content);
    return {
        update: render,
        close: removeWindow,
        bringToTop
        // , getRootEl: () => element
    };
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
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    ReactDOM.render(<Flyout title={title} onClose={removeWindow}>
        {content}
    </Flyout>, element);
    return removeWindow;
};
