import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// TODO: Fix this once style accessible smarter way
const secondaryColor = '#006ce8';

const RowContainer = styled.div`
    display: flex;
`;

const TextColumn = styled.div`
    padding-left: 10px;
    flex: 0 0 380px;
    word-wrap: break-word;
    max-width: 380px;
`;

const IconContainer = styled.div`
    display: flex;    
    width: 50px;
`;
const IconColumn = styled.div`
    padding-right: 10px;
    flex: 1;
    cursor: pointer;
`;

const IconColumnEdit = styled(IconColumn)`
    color: ${secondaryColor};
`;

export const UserStyleRow = ({ styleTitle, editUserStyleHandler, removeUserStyleHandler }) => {
    return (
        <RowContainer>
            <TextColumn>{styleTitle}</TextColumn>
            <IconContainer>
                <IconColumnEdit><EditOutlined onClick={editUserStyleHandler} /></IconColumnEdit>
                <IconColumn><DeleteOutlined onClick={removeUserStyleHandler} /></IconColumn>
            </IconContainer>
        </RowContainer>
    );
};

UserStyleRow.propTypes = {
    styleTitle: PropTypes.string.isRequired,
    editUserStyleHandler: PropTypes.func.isRequired,
    removeUserStyleHandler: PropTypes.func.isRequired
};
