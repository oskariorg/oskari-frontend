import React from 'react';
import styled from 'styled-components';
import { CloseCircleOutlined } from '@ant-design/icons';

const StyledBanner = styled('div')`
    position: fixed;
    top: 0;
    background-color: #fdf8d9;
    box-shadow: 0 5px 10px 0 #888888;
    height: auto;
    padding: 10px 15px 10px 15px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 950px;
    @media only screen and (max-width: 1025px) {
        min-width: 0;
        width: 100%
    }
    z-index: 999999;
`;

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    width: 100%;
    @media only screen and (max-width: 1025px) {
        flex-direction: column;
    }
`;

const StyledTitle = styled('span')`
    font-weight: bold;
    color: #3c3c3c;
`;

const CloseIcon = styled(CloseCircleOutlined)`
    cursor: pointer;
    color: #3c3c3c;
    font-size: 18px;
    align-self: center;
`;

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const Actions = styled('div')`
    display: flex;
    flex-direction: column;
    margin: 0 20px 0 10px;
    @media only screen and (max-width: 1025px) {
        flex-direction: column;
    }
`;

const Icon = styled('div')`
    font-size: 24px;
    margin-right: 10px;
`;

export const Banner = ({ icon, title, content, action, onClose, closable }) => {

    return (
        <StyledBanner>
            <Container>
                <Icon>
                    {icon}
                </Icon>
                <Content>
                    <StyledTitle>{title}</StyledTitle>
                    <Content>{content}</Content>
                </Content>
                <Actions>
                    {action}
                </Actions>
                {closable && (
                    <CloseIcon onClick={onClose} />
                )}
            </Container>
        </StyledBanner>
    );
};
