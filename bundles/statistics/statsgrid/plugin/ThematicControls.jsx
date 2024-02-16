import React from 'react';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import styled from 'styled-components';
import { UnorderedListOutlined, TableOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons';

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const ICONS = {
    series: <ClockCircleOutlined />,
    grid: <TableOutlined />,
    classification: <UnorderedListOutlined />,
    diagram: <BarChartOutlined />
};

export const ThematicControls = ({ mapButtons, active, toggle }) => {
    return (
        <Container>
            {mapButtons.map((id, index) => (
                <div key={index}>
                    <MapModuleButton
                        onClick={() => toggle(id)}
                        icon={ICONS[id]}
                        className={`t_${id}`}
                        iconActive={active.includes(id)}
                    />
                </div>
            ))}
        </Container>
    );
};
