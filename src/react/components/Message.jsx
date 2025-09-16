import React from 'react';
import PropTypes from 'prop-types';
import { LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

const Label = styled('div')`
    display: ${props => props.allowTextEllipsis ? 'inline' : 'inline-block'};
    overflow: ${props => props.allowTextEllipsis ? 'hidden' : ''};
    white-space: ${props => props.allowTextEllipsis ? 'nowrap' : ''};
    text-overflow: ${props => props.allowTextEllipsis ? 'ellipsis' : ''};
`;

/**
 * @class Message
 * @calssdesc <Message>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { bundleKey, messageKey, messageArgs:optional, getMessage:optional, LabelComponent:optional }
 *
 * @example <caption>Registering bundle localization</caption>
 * Oskari.registerLocalization({
 *     "lang": "en",
 *     "key": "helloworld",
 *     "value": {
 *         "hello": "Hello {name}!"
 *     }
 * });
 *
 * @example <caption>Basic usage</caption>
 * <Message bundleKey="helloworld" messageKey="hello" messageArgs={['Jack']}/>
 *
 * @example <caption>With LocaleProvider</caption>
 * <LocaleProvider value={{bundleKey: 'helloworld'}}>
 *     <Message messageKey="hello" messageArgs={['Jack']}/>
 * </LocaleProvider>
 */
const Message = ({ bundleKey, messageKey, messageArgs, defaultMsg, getMessage, fallback, children, LabelComponent = Label, allowHTML = false, allowTextEllipsis = false }) => {
    if (!messageKey) {
        return null;
    }

    let message = messageKey;

    if (bundleKey) {
        message = getMessageUsingOskariGlobal(bundleKey, messageKey, messageArgs);
    } else if (typeof getMessage === 'function') {
        message = getMessage(messageKey, messageArgs);
    }

    // If we didn't find localization AND we have default value -> use it
    if (message === messageKey && defaultMsg) {
        if (defaultMsg) {
            message = defaultMsg;
        } else if (fallback) {
            return fallback;
        }
    }
    const injectedProps = {};
    if (Oskari.isMsgDebugMode()) {
        injectedProps.onClick = () => Oskari.log('Message').debug(`Text clicked - ${bundleKey}: ${messageKey}`);
    }
    if (allowHTML) {
        return (<LabelComponent dangerouslySetInnerHTML={{ __html: message }} { ...injectedProps }></LabelComponent>);
    }

    return (
        <LabelComponent
            allowTextEllipsis={allowTextEllipsis}
            { ...injectedProps }>
            { message } { children }
        </LabelComponent>
    );
};
Message.propTypes = {
    bundleKey: PropTypes.string.isRequired,
    messageKey: PropTypes.string,
    defaultMsg: PropTypes.string,
    messageArgs: PropTypes.object,
    getMessage: PropTypes.func,
    children: PropTypes.any,
    LabelComponent: PropTypes.elementType,
    fallback: PropTypes.node,
    allowHTML: PropTypes.bool,
    allowTextEllipsis: PropTypes.bool
};

function getMessageUsingOskariGlobal (bundleKey, messageKey, messageArgs) {
    try {
        return Oskari.getMsg(bundleKey, messageKey, messageArgs);
    } catch (e) {
        // no locale provider OR bundleKey missing from locale provider
        Oskari.log('Message').warn(`Message tag used without LocaleProvider or bundleKey not provided when getting: ${messageKey}. Original error: ${e.message}`);
    }
    return messageKey;
}

const wrapped = LocaleConsumer(Message);
export { wrapped as Message };
