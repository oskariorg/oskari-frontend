import React from 'react';
import PropTypes from 'prop-types';
import { withLocale } from 'oskari-ui/util';
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

const Labelled = ({ label, children, Message }) =>
    <Elastic>
        { label &&
            <Message messageKey={label} LabelComponent={Label} />
        }
        { children }
    </Elastic>;

Labelled.propTypes = {
    label: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]).isRequired,
    Message: PropTypes.elementType.isRequired
};

const wrapped = withLocale(Labelled);
export { wrapped as Labelled };
