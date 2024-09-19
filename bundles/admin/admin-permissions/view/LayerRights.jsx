import React, { useState } from 'react';
import { Select, Message, Confirm, TextInput } from 'oskari-ui';
import { PrimaryButton, ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { LayerRightsTable } from './LayerRightsTable';
import styled from 'styled-components';

const SelectContainer = styled('div')`
    display: flex;
    width: 250px;
    align-items: center;
    margin-bottom: 15px;
`;
const StyledSelect = styled(Select)`
    width: 100%;
    margin-left: 10px;
`;
const ConfirmWrapper = styled(Confirm)`
    width: 100%;
`;
const SearchContainer = styled('div')`
    display: flex;
    flex-direction: row;
    width: 300px;
    margin-bottom: 10px;
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
    const [searchConfirmOpen, setSearchConfirmOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState(null);
    const [searchValue, setSearchValue] = useState(state.pagination.filter);
    return (
        <div>
            { !state.selectedRole && <b><Message messageKey='flyout.instruction' bundleKey='admin-permissions' /></b> }
            <SelectContainer>
                <Message messageKey='roles.title' />
                <ConfirmWrapper
                    title={<Message messageKey='flyout.unsavedChangesConfirm'/>}
                    open={roleConfirmOpen}
                    onConfirm={() => {
                        setRoleConfirmOpen(false);
                        controller.setSelectedRole(pendingRole);
                        setPendingRole(null);
                    }}
                    onCancel={() => {
                        setRoleConfirmOpen(false);
                        setPendingRole(null);
                    }}
                    okText={<Message bundleKey='oskariui' messageKey='buttons.yes'/>}
                    cancelText={<Message bundleKey='oskariui' messageKey='buttons.cancel'/>}
                    placement='top'
                    popupStyle={{zIndex: '999999'}}
                >
                    <StyledSelect
                        placeholder={<Message messageKey='roles.placeholder'/>}
                        value={state.selectedRole}
                        options={getRoleOptions(state.roles)}
                        onChange={(value) => {
                            if (state.changedIds.size !== 0) {
                                setPendingRole(value);
                                setRoleConfirmOpen(true);
                            } else {
                                controller.setSelectedRole(value);
                            }
                        }} />
                </ConfirmWrapper>
            </SelectContainer>
            { !!state.selectedRole &&
                <React.Fragment>
                    <SearchContainer>
                        <TextInput
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Confirm
                            title={<Message messageKey='flyout.unsavedChangesConfirm'/>}
                            open={searchConfirmOpen}
                            onConfirm={() => {
                                setSearchConfirmOpen(false);
                                controller.search(searchValue);
                            }}
                            onCancel={() => {
                                setSearchConfirmOpen(false);
                            }}
                            okText={<Message bundleKey='oskariui' messageKey='buttons.yes'/>}
                            cancelText={<Message bundleKey='oskariui' messageKey='buttons.cancel'/>}
                            placement='top'
                            popupStyle={{zIndex: '999999'}}
                        >
                            <PrimaryButton
                                type='search'
                                onClick={() => state.changedIds.size !== 0 ? setSearchConfirmOpen(true) : controller.search(searchValue)}
                                disabled={!state.permissions?.layers || state.permissions?.layers?.length < 1}
                            />

                        </Confirm>
                        {state.pagination.filter && state.pagination.filter !== '' && (
                            <SecondaryButton
                                type='clear'
                                onClick={controller.clearSearch}
                            />
                        )}
                    </SearchContainer>
                    <LayerRightsTable
                        controller={controller}
                        state={state}
                    />
                    <ButtonContainer>
                        <SecondaryButton
                            type='cancel'
                            onClick={() => controller.cancel()}
                        />
                        <PrimaryButton
                            type='save'
                            onClick={controller.savePermissions}
                        />
                    </ButtonContainer>
                </React.Fragment>
            }
        </div>
    );
};
