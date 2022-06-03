import React from 'react';
import styled from 'styled-components';
import { CloseCircleOutlined } from '@ant-design/icons';

const StyledBanner = styled('div')`
    position: absolute;
    top: 0;
    left: 270px;
    right: 250px;
    background-color: #fff0e2;
    box-shadow: 0 5px 10px 0 #888888;
    height: auto;
    padding: 10px 15px 10px 15px;
`;

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const StyledTitle = styled('span')`
    font-weight: bold;
    color: #5e2c00;
`;

const CloseIcon = styled(CloseCircleOutlined)`
    cursor: pointer;
    color: #5e2c00;
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
