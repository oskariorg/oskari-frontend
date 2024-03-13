import React from 'react';
import { Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { IconButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { getRegionsets } from '../../helper/ConfigHelper';

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

export const DatasetsTable = ({ state, controller }) => {
    const { datasets } = state;
    if (!datasets.length) {
        return <Message messageKey='userIndicators.datasets.noDatasets'/>;
    }
    const getRegionsetName = id => getRegionsets().find(rs => rs.id === id)?.name || '';
    const columnSettings = [
        {
            dataIndex: 'regionset',
            align: 'left',
            width: 250,
            title: <Message messageKey='userIndicators.datasets.dataset' />,
            render: (title, item) => {
                const { year, regionset } = item;
                return (
                    <a onClick={() => controller.selectIndicator(item)}>
                        <Message messageKey='parameters.year' /> {year} - {getRegionsetName(regionset)}
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

    return <StyledTable
        columns={columnSettings}
        dataSource={datasets?.map(ds => ({
            key: `${ds.regionset}-${ds.year}`,
            ...ds
        }))}
        pagination={false}/>;
};
