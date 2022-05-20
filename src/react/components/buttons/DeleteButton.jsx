import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Confirm } from 'oskari-ui';
import { SecondaryButton } from './';
import { DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors'

const DeleteIcon = styled(DeleteOutlined)`
    color: ${red.primary}
`;

export const DeleteButton = ({ 
    onConfirm,
    icon,
    title = <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>
}) => {
    const button = icon
        ? <DeleteIcon/>
        : <SecondaryButton danger type="delete"/>;
    return (
        <Confirm
            title={title}
            onConfirm={onConfirm}
            okText={<Message messageKey='buttons.delete' bundleKey='oskariui'/>}
            cancelText={<Message messageKey='buttons.cancel' bundleKey='oskariui'/>}
            placement='top'>
            {button}
        </Confirm>
    );
};
DeleteButton.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.any,
    icon: PropTypes.bool
};
