import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Flyout } from './Flyout';
import { Popup } from './Popup';

/**
 * Creates a root element to render a flyout/popup window into
 * @returns {HTMLElement}
 */
const createTmpContainer = () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    element.classList.add('oskari-react-tmp-container');
    return element;
};

/**
 * Creates a cleanup function for removing flyout/popup root element
 * @param {HTMLElement} flyout/popup root element
 * @param {Function} optional function to call when window is closed
 * @returns {Function}
 */
const createRemoveFn = (element, onClose) => {
    let isStillOnDOM = true;
    return () => {
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
};

/**
 * Creates a function that can be used to modify flyout/popup order on screen.
 * @param {HTMLElement} flyout/popup root element
 * @returns {Function}
 */
const createBringToTop = (element) => {
    return () => {
        if (document.body.lastChild !== element) {
            document.body.appendChild(element);
        }
    };
}

/**
 * Opens a an Oskari popup type of window.
 * Usage:
 *
 *       let popupController = null;
 *       btn.on('click', (event) => {
 *           if (popupController) {
 *               popupController.close();
 *               return;
 *           }
 *           popupController = showPopup('Title', 'Content', () => {
 *               // closed -> cleanup
 *               popupController = null;
 *           });
 *       });
 *
 * @param {String} title title for flyout
 * @param {String|ReactElement} content content for flyout
 * @param {Function} onClose callback that is called when the window closes
 * @returns {Object} that provides functions that can be used to close/update the flyout
 */
export const showPopup = (title, content, onClose) => {
    const element = createTmpContainer();
    const removeWindow = createRemoveFn(element, onClose);
    const bringToTop = createBringToTop(element);
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
    };
};

/**
 * Opens a an Oskari flyout type of window.
 * Usage:
 *
 *       let popupController = null;
 *       btn.on('click', (event) => {
 *           if (popupController) {
 *               popupController.close();
 *               return;
 *           }
 *           popupController = showFlyout('Title', 'Content', () => {
 *               // closed -> cleanup
 *               popupController = null;
 *           });
 *       });
 *
 * @param {String} title title for flyout
 * @param {String|ReactElement} content content for flyout
 * @param {Function} onClose callback that is called when the window closes
 * @returns {Object} that provides functions that can be used to close/update the flyout
 */
export const showFlyout = (title, content, onClose) => {
    const element = createTmpContainer();
    const removeWindow = createRemoveFn(element, onClose);
    const bringToTop = createBringToTop(element);
    const render = (title, content) => {
        ReactDOM.render(
            <Flyout title={title} onClose={removeWindow} bringToTop={bringToTop}>
                {content}
            </Flyout>, element);
    };
    render(title, content);
    return  {
        update: render,
        close: removeWindow,
        bringToTop
    };;
};
