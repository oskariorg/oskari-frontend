import React from 'react';
import { TextInput, Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    max-height: 475px;
    overflow-y: auto;
`;

export const StatisticalData = ({ state, controller }) => {
    const { regionset, dataByRegions } = state;
    if (!regionset || !dataByRegions.length) {
        return <Message messageKey='errors.regionsetsIsEmpty' />
    }
    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            width: 250,
            title: <Message messageKey='parameters.region' />
        },
        {
            dataIndex: 'value',
            align: 'left',
            width: 125,
            title: <Message messageKey='parameters.value' />,
            render: (title, item) => {
                return (
                    <TextInput
                        value={item.value || ''}
                        onChange={(e) => controller.updateRegionValue(item.key, e.target.value)}
                    />
                );
            }
        }
    ];

    return <StyledTable
        columns={columnSettings}
        dataSource={dataByRegions}
        pagination={false} />
};
