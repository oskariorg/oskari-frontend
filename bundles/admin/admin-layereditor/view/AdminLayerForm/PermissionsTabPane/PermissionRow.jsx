import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';

const RowContainer = styled.div`
    display: flex;
`;
// Add `flex-wrap:wrap;` to let divs inside a row to break/flow to additional rows.
// Note! This breaks the "table" so it's hard for user to see what permission is being set.
// Note! Handle table wider than display with another kind of UI (like listing roles as headings and permissions as list under that heading)

export const TEXT_COLUMN_SIZE = {
    width: 195,
    padding: 5
};

export const PERMISSION_TYPE_COLUMN_SIZE = {
    width: 90,
    padding: 5
};

// TODO: isHeaderRow rename prop
const TextColumn = styled.div`
    flex-grow: 1;
    width: ${TEXT_COLUMN_SIZE.width}px;
    padding-left: ${TEXT_COLUMN_SIZE.padding}px;
    align-self: ${props => props.isHeaderRow ? 'flex-end' : 'stretch'};
    font-weight: ${props => props.isHeaderRow || props.isSystemRole ? 'bold' : 'normal'};
`;

const StyledPermissionDiv = styled.div`
    flex-grow: 1;
    float: left;
    width: ${PERMISSION_TYPE_COLUMN_SIZE.width}px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: ${PERMISSION_TYPE_COLUMN_SIZE.padding}px !important;
    word-break: break-word;
`;

const Break = styled.div`
    flex-basis: 100%;
    height: 0;
`;

const HeaderPermissionText = styled.div`
    height: 80%;
    text-align: center;
    padding-bottom: 5px;
`;

const SelectAllDiv = styled.div`
    height: 20%;
    padding-bottom: 5px;
`;

export const PermissionRow = ({ isHeaderRow, checkboxes, role }) => {
    const checkboxDivs = checkboxes.map(checkbox => {
        let content = checkbox;
        if (isHeaderRow) {
            content = (
                <React.Fragment>
                    <HeaderPermissionText>{checkbox.props.description}</HeaderPermissionText>
                    <Break/>
                    <SelectAllDiv>{content}</SelectAllDiv>
                </React.Fragment>);
        }
        return (<StyledPermissionDiv key={checkbox.key}>
            {content}
        </StyledPermissionDiv>);
    });
    const label = isHeaderRow ? <Message messageKey='rights.role'/> : role.name;
    return (
        <RowContainer>
            <TextColumn isHeaderRow={isHeaderRow || role.isSystem}>
                { label }
            </TextColumn>
            { checkboxDivs }
        </RowContainer>
    );
};

PermissionRow.propTypes = {
    role: PropTypes.object,
    checkboxes: PropTypes.array.isRequired,
    isHeaderRow: PropTypes.bool.isRequired
};
