import React from 'react';
import { TextInput, Message, Button } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;
const StyledTable = styled(Table)`
    max-height: 475px;
    overflow-y: scroll;
`;

export const StatisticalData = ({ state, controller }) => {
    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            width: 250,
            title: () => {
                return <span><Message messageKey='parameters.regionset' />: {state.formData?.labels[state.selectedDataset?.regionset]}</span>
            }
        },
        {
            dataIndex: 'value',
            align: 'left',
            width: 125,
            title: () => {
                return <span><Message messageKey='parameters.year' />: {state.selectedDataset?.year}</span>
            },
            render: (title, item) => {
                return (
                    <TextInput
                        value={item.value}
                        onChange={(e) => controller.updateFormData(e.target.value, item.id)}
                    />
                );
            }
        }
    ];

    return (
        <Content>
            <StyledTable
                columns={columnSettings}
                dataSource={state.formData?.regions?.map(region => ({
                    key: region.id,
                    ...region
                }))}
                pagination={false}
            />
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={() => controller.cancelForm()}
                />
                <Button
                    onClick={() => controller.showClipboardPopup()}
                >
                    <Message messageKey='userIndicators.import.title' />
                </Button>
            </ButtonContainer>
        </Content>
    );
};
