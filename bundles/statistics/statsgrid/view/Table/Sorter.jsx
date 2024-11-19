import React from 'react';
import PropTypes from 'prop-types';
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

export const Sorter = ({ sortOrder, changeSortOrder, column }) => {
    const isActive = sortOrder.column === column;
    const order = isActive ? sortOrder.order : null;
    let icon = null;
    if (order === 'ascend') {
        icon = <CaretUpFilled />;
    } else if (order === 'descend') {
        icon = <CaretDownFilled />;
    }
    const tooltip = order === 'ascend' ? 'statsgrid.orderByDescending' : 'statsgrid.orderByAscending';
    return (
        <Tooltip title={<Message messageKey={tooltip} />}>
            <Content onClick={() => changeSortOrder(column)}>
                <Message messageKey='statsgrid.orderBy' /><Icon>{icon}</Icon>
            </Content>
        </Tooltip>
    );
};
Sorter.propTypes = {
    column: PropTypes.string.isRequired,
    changeSortOrder: PropTypes.func.isRequired,
    sortOrder: PropTypes.object.isRequired
};
