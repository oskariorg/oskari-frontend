import React from 'react';
import { Select, Option, Message } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { LayerRightsTable } from './LayerRightsTable';
import styled from 'styled-components';

const SelectContainer = styled('div')`
    display: flex;
    width: 250px;
    align-items: center;
    margin-bottom: 15px;
`;
const StyledSelect = styled(Select)`
    margin-left: 10px;
    flex-grow: 1;
`;

export const LayerRights = ({ controller, state }) => {
    return (
        <div>
            <SelectContainer>
                <Message messageKey='selectRole' />
                <StyledSelect
                    value={state.selectedRole}
                    onChange={controller.setSelectedRole}
                >
                    {state.roles.map(role => (
                        <Option key={role.id} value={role.id}>
                            {role.name}
                        </Option>
                    ))}
                </StyledSelect>
            </SelectContainer>
            <LayerRightsTable
                controller={controller}
                state={state}
            />
            <ButtonContainer>
                <PrimaryButton
                    type='save'
                    onClick={controller.savePermissions}
                />
            </ButtonContainer>
        </div>
    );
};
