import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ThemeConsumer } from '../../util/contexts';
import { getFontClass } from '../../theme/ThemeHelper';
import { Header } from './Header';

const StyledPanel = styled('div')`
    background: #FFF;
    position: relative;
    height: 100%;
    top: 0;
    /* sidebar has 3, we want to open it on top of this */
    z-index: 2;
    width: ${props => props.width || 252}px;
    display: flex;
    flex-direction: column;
    font-family: ${props => props.font};

    div.content {
        padding: 10px;
        overflow: auto;
        height: calc(100% - 46px);
    }
`;
const Content = styled('div')`
    overflow: auto;
    padding-bottom: 20px;
`;
const StyledHeader = styled(Header)`
    padding: 15px 15px 10px 10px;
`;

export const SidePanel = ThemeConsumer(({ title, onClose, children, theme = {}, options }) => {
    return (
        <StyledPanel className={`t_print_panel ${getFontClass(theme)}`} width={options.width}>
            <Content>
                <StyledHeader
                    title={title}
                    onClose={onClose}
                />
                {children}
            </Content>
        </StyledPanel>
    )
});

SidePanel.propTypes = {
    onClose: PropTypes.func.isRequired
};
