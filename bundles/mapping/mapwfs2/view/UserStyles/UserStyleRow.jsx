import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'oskari-ui';

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

export const UserStyleRow = ({ styleName, editUserStyleHandler, removeUserStyleHandler }) => {
    return (
        <RowContainer>
            <TextColumn>{styleName}</TextColumn>
            <IconContainer>
                <IconColumnEdit><Icon type="edit" onClick={editUserStyleHandler}></Icon></IconColumnEdit>
                <IconColumn><Icon type="delete" onClick={removeUserStyleHandler}></Icon></IconColumn>
            </IconContainer>
        </RowContainer>
    );
};

UserStyleRow.propTypes = {
    styleName: PropTypes.string.isRequired,
    editUserStyleHandler: PropTypes.func.isRequired,
    removeUserStyleHandler: PropTypes.func.isRequired
};
