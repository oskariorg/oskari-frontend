import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from 'oskari-ui/components/buttons';

const RowContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TextColumn = styled.div`
    padding-left: 10px;
    word-wrap: break-word;
`;

const IconContainer = styled.div`
    Button {
        margin-left: 10px;
    }
`;

export const UserStyleRow = ({ name, onEdit, onDelete }) => {
    return (
        <RowContainer>
            <TextColumn>{name}</TextColumn>
            <IconContainer>
                <IconButton
                    type='edit'
                    onClick={onEdit}
                />
                <IconButton
                    type='delete'
                    onConfirm={onDelete}
                />
            </IconContainer>
        </RowContainer>
    );
};

UserStyleRow.propTypes = {
    name: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};
