import React from 'react';
import { Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { IconButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    max-height: 475px;
    overflow-y: auto;
`;
const ButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    button {
        margin-left: 5px;
    }
`;

export const IndicatorDatasets = ({ state, controller }) => {
    const columnSettings = [
        {
            dataIndex: 'regionset',
            align: 'left',
            width: 250,
            title: <Message messageKey='userIndicators.modify.title' />,
            render: (title, item) => {
                const regionset = state.regionsetOptions.find(r => r.id === item.regionset) || {};
                return (
                    <a onClick={() => controller.selectIndicator(item)}>
                        <Message messageKey='parameters.year' /> {item.year} - {regionset.name}
                    </a>
                );
            }
        },
        {
            align: 'right',
            width: 125,
            render: (title, item) => {
                return (
                    <ButtonContainer>
                        <IconButton
                            type='edit'
                            onClick={() => controller.editDataset(item)}
                        />
                        <IconButton
                            type='delete'
                            onConfirm={() => controller.deleteDataset(item)}
                        />
                    </ButtonContainer>
                );
            }
        }
    ];

    return (
        <StyledTable
            columns={columnSettings}
            dataSource={state.datasets?.map(ds => ({
                key: `${ds.regionset}-${ds.year}`,
                ...ds
            }))}
            pagination={false}
        />
    );
};
