import React, { useState } from 'react';
import { MapButton, Toolbar } from 'oskari-ui/components/buttons';
import { ThemeProvider } from 'oskari-ui/util/contexts';
import styled from 'styled-components';

const Container = styled('div')`
    width: 32px;
    height: 32px;
    position: relative;
    ${props => props.noMargin ? 'margin: 0' : 'margin: 10px 10px 0 10px'};
    ${props => props.withToolbar && props.toolbarOpen && props.toolbarMargin};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledButton = styled(MapButton)`
    z-index: 1;
`;
export const MapModuleButton = ({ visible = true, title, icon, onClick, size = '32px', noMargin = false, iconActive = false, withToolbar = false, iconSize = '18px', className, children, disabled = false, position, toolbarDirection, useCustomIconStyle }) => {
    if (!visible) {
        return null;
    }
    const [toolbarOpen, setToolbarOpen] = useState(false);

    let toolbarOpenDirection = 'right';
    if (toolbarDirection) {
        toolbarOpenDirection = toolbarDirection;
    } else if (position) {
        if (position.includes('left')) toolbarOpenDirection = 'right';
        else toolbarOpenDirection = 'left';
    }

    let toolbarMaxWidth = 50;
    const marginDirection = toolbarOpenDirection === 'right' ? 'right' : 'left';
    let toolbarMargin = `margin-${marginDirection}: 0`;
    if (withToolbar && toolbarOpen && children) {
        toolbarMaxWidth = children.length * 34 + 10;
        toolbarMargin = `margin-${marginDirection}: ${toolbarMaxWidth}px`;
    }
    // FIXME: we shouldn't reference mapmodule here, BUT the themeprovider should be in map module and not here.
    // after we have fully migrated the tools on map to React we can pass theme from map module with ThemeProvider and remove it from here.
    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    return (
        <ThemeProvider value={mapModule.getMapTheme()}>
            <Container size={size} noMargin={noMargin} withToolbar={withToolbar} toolbarOpen={toolbarOpen} toolbarMargin={toolbarMargin}>
                {withToolbar && children?.length === 1 ? (
                    <StyledButton
                        onClick={children[0].props.onClick}
                        icon={children[0].props.icon}
                        title={children[0].props.title}
                        size={size}
                        iconActive={children[0].props.iconActive}
                        iconSize={iconSize}
                        className={className}
                        disabled={disabled}
                        position={position}
                        useCustomIconStyle={useCustomIconStyle}
                    />
                ) : (
                    <>
                        <StyledButton
                            onClick={withToolbar ? () => setToolbarOpen(!toolbarOpen) : onClick}
                            icon={icon}
                            title={title}
                            size={size}
                            iconActive={iconActive || (withToolbar && toolbarOpen)}
                            iconSize={iconSize}
                            className={className}
                            disabled={disabled}
                            position={position}
                            useCustomIconStyle={useCustomIconStyle}
                        />
                        {withToolbar && (
                            <Toolbar height='32px' open={toolbarOpen} direction={toolbarOpenDirection} toolbarWidth={toolbarMaxWidth} maxWidth={toolbarMaxWidth + 100}>
                                {children}
                            </Toolbar>
                        )}
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
};
