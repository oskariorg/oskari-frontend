import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Message, Confirm } from 'oskari-ui';
import { LayerRightsTable } from './LayerRightsTable';
import { LayerRightsSearch } from './LayerRightsSearch';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`;
const StyledSelect = styled(Select)`
    width: 250px;
    margin-left: 10px;
`;
const Instruction = styled.span`
    font-style: italic;
`;

const getRoleOptions = roles => {
    return [{
        title: 'system',
        label: <Message messageKey='roles.type.system' />,
        options: roles.filter(r => r.isSystem)
    }, {
        title: 'other',
        label: <Message messageKey='roles.type.other' />,
        options: roles.filter(r => !r.isSystem)
    }];
};

export const LayerRights = ({ controller, state }) => {
    const [roleConfirmOpen, setRoleConfirmOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState(null);
    const hasChanges = Object.keys(state.unSavedChanges).length > 0;
    const roleSelected = !!state.selectedRole;

    const onRoleChange = role => {
        if (hasChanges) {
            setPendingRole(role);
            setRoleConfirmOpen(true);
        } else {
            controller.setSelectedRole(role);
        }
    };
    const onRoleConfirm = confirm => {
        if (confirm) {
            controller.setSelectedRole(pendingRole);
        }
        setPendingRole(null);
        setRoleConfirmOpen(false);
    };
    return (
        <div>
            <Container>
                <Message messageKey='roles.title' />
                <Confirm
                    title={<Message messageKey='flyout.unsavedChangesConfirm'/>}
                    open={roleConfirmOpen}
                    onConfirm={() => onRoleConfirm(true) }
                    onCancel={() => onRoleConfirm(false) }>
                    <StyledSelect
                        placeholder={<Message messageKey='roles.placeholder'/>}
                        value={state.selectedRole}
                        options={getRoleOptions(state.roles)}
                        onChange={value => onRoleChange(value)}/>
                </Confirm>
                { roleSelected && <LayerRightsSearch controller={controller} state={state} /> }
            </Container>
            { roleSelected && <LayerRightsTable controller={controller} state={state} /> }
            { !roleSelected && <Instruction><Message messageKey={`flyout.instruction`} /></Instruction> }
        </div>
    );
};

LayerRights.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
