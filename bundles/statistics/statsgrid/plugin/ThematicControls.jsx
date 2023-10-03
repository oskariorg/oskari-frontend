import React from 'react';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import styled from 'styled-components';

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const ThematicControls = ({ tools }) => {
    return (
        <Container>
            {tools.map((tool, index) => (
                <div key={index}>
                    <MapModuleButton
                        onClick={() => tool.clickHandler()}
                        icon={tool.icon}
                        className={`t_${tool.name}`}
                        iconActive={tool.active}
                    />
                </div>
            ))}
        </Container>
    )
}
