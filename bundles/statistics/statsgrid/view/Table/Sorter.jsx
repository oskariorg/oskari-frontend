import React from 'react';
import { Message, Tooltip } from 'oskari-ui';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
`;
const Icon = styled('div')`
    margin-left: 5px;
`;

export const Sorter = ({ sortOrder, changeSortOrder }) => {
    let icon = <CaretDownFilled />;
    if (sortOrder === 'ascend') {
        icon = <CaretUpFilled />;
    }
    return (
        <Tooltip
            title={sortOrder === 'ascend' ? <Message messageKey='statsgrid.orderByDescending' /> : <Message messageKey='statsgrid.orderByAscending' />}
        >
            <Content onClick={changeSortOrder}>
                <Message messageKey='statsgrid.orderBy' /><Icon>{icon}</Icon>
            </Content>
        </Tooltip>
    );
};
