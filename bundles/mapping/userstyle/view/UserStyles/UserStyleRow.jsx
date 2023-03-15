import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from 'oskari-ui/components/buttons';

const TextColumn = styled.div`
    padding-left: 10px;
    word-wrap: break-word;
`;

const IconContainer = styled.div`
    button {
        width: 24px;
        height: 24px;
    }
    padding-right: 5px;
`;

export const UserStyleRow = ({ name, onEdit, onDelete }) => {
    return (
        <Fragment>
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
        </Fragment>
    );
};

UserStyleRow.propTypes = {
    name: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};
