import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { Empty } from 'antd';

const StyledDiv = styled('div')`
    margin: 25px;
`;

const LayerTypeNotSupported = ({ type }) => (
    <StyledDiv>
        <Empty description={
            <span><Message messageKey='layerStatus.unsupportedType' />: <b>{type}</b></span>
        }/>
    </StyledDiv>
);

LayerTypeNotSupported.propTypes = {
    type: PropTypes.string.isRequired
};

export { LayerTypeNotSupported };
