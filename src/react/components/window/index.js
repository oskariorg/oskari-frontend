import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Flyout } from './Flyout';
import { Popup } from './Popup';
import { Alert } from 'antd';

/* ************************************************
 * Note! The API is not finalized and can change unexpectedly!!
 * ************************************************ */
const ID_PREFIX = 'abstract-';
const NAME = 'OskariWindowing';
export const PLACEMENTS = {
    TOP: 'top',
    BOTTOM: 'bottom',
    RIGHT: 'right',
    LEFT: 'left',
    TL: 'topLeft',
    TR: 'topRight',
    BL: 'bottomLeft',
    BR: 'bottomRight'
};

const DEFAULT_POPUP_OPTIONS = {
    isDraggable: true
};

(function (sb) {
    const module = {
        init: function (sb) {
            sb.registerForEventByName(this, 'UIChangeEvent');
        },
        getName: function () {
            return NAME;
        },
        onEvent: function () {
            Object.values(active).forEach(o => typeof o === 'function' && o());
            active = {};
        }
    };

    sb.register(module);
})(Oskari.getSandbox());

let active = {}; // id: removeFn

const validate = (options) => {
    const { id } = options;
    const seq = Oskari.getSeq(NAME);
    if (active[id]) {
        const newId = id + '-' + seq.nextVal();
        options.id = newId;
        Oskari.log(NAME).warn(`Popup or flyout is already added with id: ${id}, changed to: ${newId}`);
        return;
    }

    if (!id) {
        options.id = ID_PREFIX + seq.nextVal();
    }
};

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
const createRemoveFn = (element, onClose, id) => {
    const removeFn = () => {
        if (!active[id]) {
            return;
        }
        unmountComponentAtNode(element);
        document.body.removeChild(element);
        delete active[id];
        if (typeof onClose === 'function') {
            onClose();
        }
    };
    active[id] = removeFn;
    return removeFn;
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
 * @param {Object} options (optional) to override default options
 * @returns {Object} that provides functions that can be used to close/update the flyout
 */
export const showPopup = (title, content, onClose, options = {}) => {
    validate(options);
    const element = createTmpContainer();
    const removeWindow = createRemoveFn(element, onClose, options.id);
    const bringToTop = createBringToTop(element);
    const opts = {...DEFAULT_POPUP_OPTIONS, ...options };
    const render = (title, content) => {
        ReactDOM.render(
            <Popup title={title} onClose={removeWindow} bringToTop={bringToTop} options={opts}>
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
 * @param {Object} options (optional) to override default options
 * @returns {Object} that provides functions that can be used to close/update the flyout
 */
export const showFlyout = (title, content, onClose, options = {}) => {
    validate(options);
    const element = createTmpContainer();
    const removeWindow = createRemoveFn(element, onClose, options.id);
    const bringToTop = createBringToTop(element);
    const render = (title, content) => {
        ReactDOM.render(
            <Flyout title={title} onClose={removeWindow} bringToTop={bringToTop} options={options}>
                {content}
            </Flyout>, element);
    };
    render(title, content);
    return  {
        update: render,
        close: removeWindow,
        bringToTop
    };
};


/**
 * 
 * @param {String} type Antd Alert type
 * @param {Function} onClose 
 * @param {object} props Antd Alert props 
 * @returns 
 */
export const showBanner = (type, onClose, props) => {
    const element = createTmpContainer();
    const removeWindow = createRemoveFn(element, onClose);
    const bringToTop = createBringToTop(element);

    const render = (props) => {
        ReactDOM.render(
            <Alert
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '270px',
                    height: 'auto',
                    width: 'auto',
                    right: '250px',
                    border: 'none',
                    backgroundColor: '#fff0e2',
                    boxShadow: '0 5px 10px 0 #888888'
                }}
                {...props}
            />, element);
    };
    render({type, onClose, ...props});
    return  {
        update: render,
        close: removeWindow,
        bringToTop
    };
}
