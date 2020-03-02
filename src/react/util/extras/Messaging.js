import React from 'react';
import { notification, message } from 'antd';
import 'antd/es/notification/style/index.js';
import 'antd/es/message/style/index.js';

const NOTIFICATION = 'notification';
const ALERT = 'message';
const SUCCESS = 'success';
const INFO = 'info';
const LOADING = 'loading';
const WARN = 'warn';
const WARNING = 'warn';
const ERROR = 'error';

const getBroker = (options = {}) => {
    const type = getType(options);
    if (type === NOTIFICATION) {
        return [notification, toNotificationOptions(options)];
    }
    return [message, toMessageOptions(options)];
};
const notificationOptions = ['title', 'placement', 'closeIcon', 'onClick', 'style'];
const getType = options => {
    if (options.type) {
        return options.type === NOTIFICATION ? NOTIFICATION : ALERT;
    }
    const notificationOptionKeyFound = !!Object.keys(options).find(key => notificationOptions.includes(key));
    return notificationOptionKeyFound ? NOTIFICATION : ALERT;
};
const toNotificationOptions = (options) => {
    const { title, content, ...rest } = options;
    const notificationOptions = {
        ...rest,
        message: title,
        description: content
    };
    delete notificationOptions.type;
    delete notificationOptions.level;
    return notificationOptions;
};
const toMessageOptions = options => {
    const messageOptions = { ...options };
    ['type', 'level', 'title', 'placement', 'closeIcon', 'onClick', 'style'].forEach(key => {
        delete messageOptions[key];
    });
    return messageOptions;
};

const validate = (options) => {
    if (!options) {
        return {};
    }
    if (typeof options === 'string') {
        return { content: options };
    }
    if (typeof options === 'object') {
        return options.content ? options : { content: options };
    }
    if (React.isValidElement(options)) {
        return { content: options };
    }
    return {};
};

/**
 * The options object for Messaging.
 * @typedef {Object} Messaging~Options
 * @property {string} [type] - Message type. One of ('notification'|'message').
 * @property {string} [level] - Message level. One of ('success'|'info'|'loading'|'warn'|'error').
 * @property {ReactNode} content - Content for the message.
 * @property {string} [key] - Message identifier.
 * @property {number} [duration] - Duration for auto-closing. Null means no auto-closing.
 * @property {function} [onClose] - Close callback.
 * @property {ReactNode} [icon] - Customized icon.
 * @property {ReactNode} [title] - Title for the message, only supported for notification type.
 * @property {string} [placement] - Only for notification type, location of the message. One of ('topLeft'|'topRight|'bottomLeft'|'bottomRight').
 * @property {ReactNode} [closeIcon] - Custom close icon.
 * @property {function} [onClick] - Click callback.
 * @property {object} [style] - Inline style.
 */

/**
 * Utility for showing global messages.
 *
 * @example
 * import { React } from 'react';
 * import { Message } from 'oskari-ui';
 * import { Messaging } from 'oskari-ui/util';
 *
 * // Simple usage
 * Messaging.open('Hello world');
 *
 * // The localized way
 * Messaging.open(<Message messageKey='hello' bundleKey='my-hello-world-bundle'/>);
 *
 * // Localized error message
 * Messaging.open({
 *     title: <Message messageKey='error.notfound.title' bundleKey='my-bundle'/>,
 *     content: <Message messageKey='error.notfound.content' bundleKey='my-bundle'/>,
 *     level: Messaging.LEVEL.ERROR
 * });
 *
 * // Localized error alert with a shortcut
 * Messaging.error(<Message messageKey='error.notfound.content' bundleKey='my-bundle'/>);
 */
class Messaging {
    constructor () {
        notification.config({
            placement: 'topLeft',
            top: 50,
            duration: 10
        });
    }
    /** @param {Messaging~Options} option */
    open (options) {
        const validOptions = validate(options);
        if (!validOptions) {
            return;
        }
        const { level, ...rest } = validOptions;
        const [ broker, brokerOptions ] = getBroker(rest);
        if (!level || !broker.hasOwnProperty(level)) {
            broker.open(brokerOptions);
            return;
        }
        broker[level](brokerOptions);
    }
    /** @param {Messaging~Options} options **/
    success (options) {
        this.open({ ...validate(options), level: SUCCESS });
    }
    /** @param {Messaging~Options} options */
    info (options) {
        this.open({ ...validate(options), level: INFO });
    }
    /** @param {Messaging~Options} options */
    alert (options) {
        this.info({ ...validate(options), type: ALERT });
    }
    /** @param {Messaging~Options} options */
    notify (options) {
        this.info({ ...validate(options), type: NOTIFICATION });
    }
    /** @param {Messaging~Options} options */
    warn (options) {
        this.open({ ...validate(options), level: WARN });
    }
    /** @param {Messaging~Options} options */
    warning (options) {
        this.warn(options);
    }
    /** @param {Messaging~Options} options */
    error (options) {
        this.open({ ...validate(options), level: ERROR });
    }
    /** @param {Messaging~Options} options */
    loading (options) {
        this.open({ ...validate(options), level: LOADING });
    }
    /** @param {string} key */
    close (key) {
        notification.close(key);
    }
    destroy () {
        notification.destroy();
        message.destroy();
    }
};

/**
 * @property {string} NOTIFICATION Notification with a title.
 * @property {string} ALERT Message box on upper-center.
 * @property {string} MESSAGE Alias for ALERT.
 * @memberof Messaging
 **/
const TYPE = { NOTIFICATION, ALERT, MESSAGE: ALERT };
Object.defineProperty(Messaging, 'TYPE', {
    value: TYPE,
    writable: false,
    enumerable: true,
    configurable: false
});

/**
 * @property {string} SUCCESS Message with success icon.
 * @property {string} INFO Message with info icon.
 * @property {string} LOADING Message with warning loading icon. Only valid for ALERT and MESSAGE types.
 * @property {string} WARN Message with warning icon.
 * @property {string} WARNING Alias for WARN.
 * @property {string} ERROR Message with error icon.
 * @memberof Messaging
 **/
const LEVEL = { SUCCESS, INFO, LOADING, WARN, WARNING, ERROR };
Object.defineProperty(Messaging, 'LEVEL', {
    value: LEVEL,
    writable: false,
    enumerable: true,
    configurable: false
});

const MessagingSingleton = new Messaging();
export { MessagingSingleton as Messaging };
