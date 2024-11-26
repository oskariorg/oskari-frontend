import React from 'react';
import { Modal as AntModal } from 'antd';
import { ThemeConsumer } from '../../util/contexts';
import { Header } from 'oskari-ui/components/window/Header';

const styles = {
    body: {
        padding: '0 0 0.5em 0'
    },
    content: {
        padding: '0'
    }
};

export const Modal = ThemeConsumer(({children, title,  options={}, theme={}}) => {
    return <AntModal zIndex={100000} styles={styles} open={true} closable={false} centered={true} footer={null}>
        <div>
            <Header title={title} isDraggable={false}/>
            {children}
        </div>
    </AntModal>;
});