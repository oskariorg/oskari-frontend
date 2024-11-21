import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';

const Container = styled.div`
    padding: 3px 10px 5px 10px;
`;

export const InactiveLegend = ({ error }) => {
    return (
        <Container className="t_legend-noactive">
            <Message messageKey={`errors.${error}`}/>
        </Container>
    );
};

InactiveLegend.propTypes = {
    error: PropTypes.string.isRequired
};
