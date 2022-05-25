import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip } from 'oskari-ui';
import { EditOutlined } from '@ant-design/icons';

const Icon = styled.div`
    cursor: pointer;
`;

export const Edit = ({
    onClick,
    tooltip = <Message messageKey='buttons.edit' bundleKey='oskariui'/>
}) => (
    <Tooltip title={tooltip}>
        <Icon className='t_edit' onClick={onClick}>
            <EditOutlined/>
        </Icon>
    </Tooltip>
);

Edit.propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.any
};
