import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    max-height: 475px;
    overflow-y: auto;
`;
const Space = styled.div`
    height: 80px;
`;

export const StatisticalData = ({ state, controller }) => {
    const { regionset, dataByRegions, loading } = state;
    if (loading) {
        return <Space/>;
    }
    if (!regionset || !dataByRegions.length) {
        return <Message messageKey='errors.regionsetsIsEmpty' />;
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
                        value={item.value}
                        onChange={(e) => controller.updateRegionValue(item.key, e.target.value)}
                    />
                );
            }
        }
    ];

    return <StyledTable
        columns={columnSettings}
        dataSource={dataByRegions}
        pagination={false} />;
};
StatisticalData.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
