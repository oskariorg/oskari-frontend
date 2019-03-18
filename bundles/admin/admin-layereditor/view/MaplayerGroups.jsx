import React from 'react';

import { Checkbox } from '../components/Checkbox';
import { List } from '../components/List';

export const MaplayerGroups = (props) => {
    // TODO
    const dataSource = [
        <Checkbox key='option1'>Geographical names</Checkbox>,
        <Checkbox key='option2'>Administrative units</Checkbox>,
        <Checkbox key='option3'>Addresses</Checkbox>
    ];

    return (
        <List dataSource={dataSource} />
    );
};
