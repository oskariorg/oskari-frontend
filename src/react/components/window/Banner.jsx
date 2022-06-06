import React from 'react';
import styled from 'styled-components';
import { CloseCircleOutlined } from '@ant-design/icons';

const COLOR = '#fdf8d9'

const StyledBanner = styled('div')`
    position: fixed;
    top: 0;
    background-color: ${COLOR};
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





export const Banner = ({ content, onClose, options }) => {
    const containerProps = {
        className: `t_banner t_${options.id}`
    };
    return (
        <StyledBanner>
            <Container {...containerProps}>
                <Content>
                    {content}
                </Content>
                <CloseIcon className='t_button t_close' onClick={onClose} />
            </Container>
        </StyledBanner>
    );
};
