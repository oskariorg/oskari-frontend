import React from 'react';
import { Modal as AntModal } from 'antd';
import { ThemeConsumer } from '../../util/contexts';
import styled from 'styled-components';
import { Header } from 'oskari-ui/components/window/Header';
const StyledModal = styled(AntModal)`
    .ant-modal-body {
        padding: 0.5em 0;
    }
`;

export const Modal = ThemeConsumer(({children, title,  options={}, theme={}}) => {
    return <StyledModal open={true} closable={false} centered={true} footer={null}>
        <div>
            <Header title={title} isDraggable={false}/>
            {children}
        </div>
    </StyledModal>;
});