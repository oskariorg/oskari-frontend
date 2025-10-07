import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

export const Label = styled('div')`
    margin-right: 5px;
`;

const Elastic = styled('div')`
    display: flex;
    align-items: center;
    > :not(${Label}) {
        flex-grow: 1;
        flex-shrink: 1;
    }
`;

const Labelled = ({ messageKey, children }) =>
    <Elastic>
        { messageKey &&
            <Message messageKey={messageKey} LabelComponent={Label} />
        }
        { children }
    </Elastic>;

Labelled.propTypes = {
    messageKey: PropTypes.string,
    children: PropTypes.any.isRequired
};

const wrapped = LocaleConsumer(Labelled);
export { wrapped as Labelled };
