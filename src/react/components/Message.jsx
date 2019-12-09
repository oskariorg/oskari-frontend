import React from 'react';
import PropTypes from 'prop-types';
import { withLocale } from 'oskari-ui/util';
import styled from 'styled-components';

const Label = styled('div')`
    display: inline-block;
`;

const Message = ({ bundleKey, messageKey, messageArgs, getMessage, LabelComponent = Label }) => {
    if (!messageKey) {
        return null;
    }
    const message = typeof getMessage === 'function'
        ? getMessage(messageKey, messageArgs)
        : Oskari.getMsg(bundleKey, messageKey, messageArgs);
    return (
        <LabelComponent onClick={() => Oskari.log().debug(`Text clicked - ${bundleKey}: ${messageKey}`)}>
            { message }
        </LabelComponent>
    );
};
Message.propTypes = {
    bundleKey: PropTypes.string.isRequired,
    messageKey: PropTypes.string,
    messageArgs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    getMessage: PropTypes.func,
    LabelComponent: PropTypes.elementType
};

const wrapped = withLocale(Message);
export { wrapped as Message };
