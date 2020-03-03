import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RowContainer = styled.div`
    display: flex;
`;
// Add `flex-wrap:wrap;` to let divs inside a row to break/flow to additional rows.
// Note! This breaks the "table" so it's hard for user to see what permission is being set.
// Note! Handle table wider than display with another kind of UI (like listing roles as headings and permissions as list under that heading)

const TextColumn = styled.div`
    flex-grow: 1;
    width: 195px;
    padding-left: 5px;
    align-self: ${props => props.isHeaderRow ? 'flex-end' : 'stretch'};
`;

const StyledPermissionDiv = styled.div`
    flex-grow: 1;
    float: left;
    width: 110px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 5px !important;
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

export const PermissionRow = (props) => {
    const checkboxDivs = props.checkboxes.map(checkbox => {
        var content = checkbox;
        if (props.isHeaderRow) {
            content = (
                <React.Fragment>
                    <HeaderPermissionText>{checkbox.props.permissionDescription}</HeaderPermissionText>
                    <Break/>
                    <SelectAllDiv>{content}</SelectAllDiv>
                </React.Fragment>);
        }
        return (<StyledPermissionDiv key={checkbox.key}>
            {content}
        </StyledPermissionDiv>);
    });

    return (
        <RowContainer>
            <TextColumn isHeaderRow={props.isHeaderRow}>
                { props.text }
            </TextColumn>
            { checkboxDivs }
        </RowContainer>
    );
};

PermissionRow.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    checkboxes: PropTypes.array.isRequired,
    isHeaderRow: PropTypes.bool.isRequired
};
