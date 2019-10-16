import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox } from 'oskari-ui';

const RowContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const TextColumn = styled.div`
    flex-grow: 1;
    width: 195px;
`;

const HeaderTextColumn = styled.div`
    flex-grow: 1;
    width: 195px;
    align-self: flex-end;
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
    const permissionTypes = [];
    props.permissionTypes.forEach(permission => {
        if (props.isHeaderRow) {
            permissionTypes.push(<StyledPermissionDiv key={permission.id}><HeaderPermissionText>{permission.selectionText}</HeaderPermissionText><Break/><SelectAllDiv><Checkbox/></SelectAllDiv></StyledPermissionDiv>);
        } else {
            permissionTypes.push(<StyledPermissionDiv key={permission.id}><Checkbox/></StyledPermissionDiv>);
        }
    });

    return (
        props.isHeaderRow
            ? <RowContainer>
                <HeaderTextColumn>
                    { props.rowText}
                </HeaderTextColumn>
                { permissionTypes }
            </RowContainer>
            : <RowContainer>
                <TextColumn>
                    { props.rowText}
                </TextColumn>
                { permissionTypes }
            </RowContainer>
    );
};

PermissionRow.propTypes = {
    rowText: PropTypes.string.isRequired,
    role: PropTypes.object,
    permissionTypes: PropTypes.array.isRequired,
    isHeaderRow: PropTypes.bool.isRequired
};
