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
    const { selected } = state;
    if (!selected) {
        return <Instruction><Message messageKey={`flyout.instruction`} /></Instruction>;
    }
    if (selected === 'permissions') {
        return <LayerRightsSummary controller={controller} state={state} />;
    }
    if (selected === 'layer') {
        return <LayerDetails controller={controller} state={state} />;
    }
    return <LayerRightsTable controller={controller} state={state} />;
};
Table.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};

const getOptions = roles => {
    return [{
        title: 'summary',
        label: <Message messageKey='flyout.select.summary' />,
        options: SUMMARY.map(value => ({ value, label: <Message messageKey={`flyout.select.${value}`} /> }))
    }, {
        title: 'system',
        label: <Message messageKey='roles.type.system' />,
        options: roles.filter(r => r.isSystem).map(r => ({ value: r.id, label: r.name }))
    }, {
        title: 'other',
        label: <Message messageKey='roles.type.other' />,
        options: roles.filter(r => !r.isSystem).map(r => ({ value: r.id, label: r.name }))
    }];
};

export const LayerRights = ({ controller, state }) => {
    const [roleConfirmOpen, setRoleConfirmOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState(null);
    const hasChanges = Object.keys(state.unSavedChanges).length > 0;
    const showSearch = state.selected && state.selected !== 'layer';

    const onRoleChange = role => {
        if (hasChanges) {
            setPendingRole(role);
            setRoleConfirmOpen(true);
        } else {
            controller.setSelected(role);
        }
    };
    const onRoleConfirm = confirm => {
        if (confirm) {
            controller.setSelected(pendingRole);
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
                    onCancel={() => onRoleConfirm(false) }>
                    <StyledSelect
                        placeholder={<Message messageKey='flyout.select.placeholder'/>}
                        value={state.selected}
                        options={getOptions(state.roles)}
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
