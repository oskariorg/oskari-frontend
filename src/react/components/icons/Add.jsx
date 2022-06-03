import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip } from 'oskari-ui';
import { PlusCircleOutlined } from '@ant-design/icons';
import { green } from '@ant-design/colors';

const Icon = styled.div`
    cursor: pointer;
    color: ${green.primary}
`;

export const Add = ({
    onClick,
    tooltip = <Message messageKey='buttons.add' bundleKey='oskariui'/>
}) => (
    <Tooltip title={tooltip}>
        <Icon className='t_icon-add' onClick={onClick}>
            <PlusCircleOutlined/>
        </Icon>
    </Tooltip>
);

Add.propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.any
};
