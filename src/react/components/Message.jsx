import React from 'react';
import PropTypes from 'prop-types';
import { LocaleConsumer } from 'oskari-ui/util';
import { styled } from 'styled-components';

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
 * @param {React.ElementType} [props.LabelComponent] Wrapper used for rendering the localized content.
 * Accepts either a React component or a dom element name as a string, for example 'div', 'span' or 'li'.
 * The wrapper must be able to render children, so void elements such as img are not supported (=will throw a runtime error).
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
 *
 * @example <caption>Using an intrinsic DOM element as wrapper</caption>
 * <Message messageKey="error.required" LabelComponent='li' />
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

    const labelProps = { ...injectedProps };
    // Only default Label - component will handle text ellipsis. For custom components / dom element strings we should just ignore it.
    if (LabelComponent === Label) {
        labelProps.allowTextEllipsis = allowTextEllipsis;
    }

    return (
        <LabelComponent
            { ...labelProps }>
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
    fallback: PropTypes.any,
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
