import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { Message } from 'oskari-ui';
import { getPopupOptions } from '../pluginPopupHelper';

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const PopupContent = ({ results, description, showResult }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='plugin.SearchPlugin.column_name' bundleKey='MapModule' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => showResult(item)}>{title}</a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='plugin.SearchPlugin.column_village' bundleKey='MapModule' />,
            dataIndex: 'region',
            sorter: getSorterFor('region'),
        },
        {
            align: 'left',
            title: <Message messageKey='plugin.SearchPlugin.column_type' bundleKey='MapModule' />,
            dataIndex: 'type',
            sorter: getSorterFor('type')
        }
    ];
    return (
        <StyledContent>
            <span>{description}</span>
            <Table
                columns={columnSettings}
                dataSource={results.map((item, index) => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
            />
        </StyledContent>
    );
};

export const showResultsPopup = (title, description, results = [], showResult, onClose, pluginLocation) => {
    const options = getPopupOptions({
        getName: () => 'searchResults',
        getLocation: () => pluginLocation
    });
    return showPopup(title, <PopupContent description={description} results={results} showResult={showResult} />, onClose, options);
};
