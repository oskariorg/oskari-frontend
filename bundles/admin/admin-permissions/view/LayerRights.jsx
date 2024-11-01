import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Message, Confirm } from 'oskari-ui';
import { LayerRightsTable } from './LayerRightsTable';
import { LayerRightsSummary } from './LayerRightsSummary';
import { LayerRightsSearch } from './LayerRightsSearch';
import { LayerDetails } from './LayerDetails';
import styled from 'styled-components';

const SUMMARY = ['permissions', 'layer'];

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

const Table = ({ controller, state }) => {
    const { selectedRole } = state;
    if (!selectedRole) {
        return <Instruction><Message messageKey={`flyout.instruction`} /></Instruction>;
    }
    if (selectedRole === 'permissions') {
        return <LayerRightsSummary controller={controller} state={state} />;
    }
    if (selectedRole === 'layer') {
        return <LayerDetails controller={controller} state={state} />;
    }
    return <LayerRightsTable controller={controller} state={state} />;
};
Table.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};

const getRoleOptions = roles => {
    const mapped = roles.map(r => ({ label: r.name, value: r.id, isSystem: r.type !== 'other' }));
    return [{
        title: 'summary',
        label: <Message messageKey='flyout.select.summary' />,
        options: SUMMARY.map(value => ({ value, label: <Message messageKey={`flyout.select.${value}`} /> }))
    }, {
        title: 'system',
        label: <Message messageKey='roles.type.system' />,
        options: mapped.filter(r => r.isSystem)
    }, {
        title: 'other',
        label: <Message messageKey='roles.type.other' />,
        options: mapped.filter(r => !r.isSystem)
    }];
};

export const LayerRights = ({ controller, state }) => {
    const [roleConfirmOpen, setRoleConfirmOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState(null);
    const hasChanges = Object.keys(state.unSavedChanges).length > 0;
    const showSearch = state.selectedRole && state.selectedRole !== 'layer';

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
                <Message messageKey='flyout.select.label' />
                <Confirm
                    title={<Message messageKey='flyout.unsavedChangesConfirm'/>}
                    open={roleConfirmOpen}
                    onConfirm={() => onRoleConfirm(true) }
                    onCancel={() => onRoleConfirm(false) }
                    okText={<Message bundleKey='oskariui' messageKey='buttons.yes'/>}
                    cancelText={<Message bundleKey='oskariui' messageKey='buttons.cancel'/>}
                    placement='top'
                    popupStyle={{ zIndex: '999999' }}>
                    <StyledSelect
                        placeholder={<Message messageKey='flyout.select.placeholder'/>}
                        value={state.selectedRole}
                        options={getRoleOptions(state.roles)}
                        onChange={value => onRoleChange(value)}/>
                </Confirm>
                { showSearch && <LayerRightsSearch controller={controller} state={state} /> }
            </Container>
            <Table controller={controller} state={state} />
        </div>
    );
};

LayerRights.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
