import React from 'react';
import { notification } from 'antd';
import { Button, Message } from 'oskari-ui';

export const confirmEdit = (getMessage, onConfirm) => {
    const key = `open${Date.now()}`;
    const confirmBtn = (<Button
        type="primary"
        onClick={() => {
            onConfirm(true);
            notification.destroy(key);
        }}>
        {<Message bundleKey={'ContentEditor'} messageKey={'ContentEditorView.buttons.yes'}/>}
    </Button>);
    notification.open({
        message: <Message bundleKey={'ContentEditor'} messageKey={'ContentEditorView.editConfirm.title'}/>,
        description: <Message bundleKey={'ContentEditor'} messageKey={'ContentEditorView.editConfirm.msg'}/>,
        btn: confirmBtn,
        key
    });
};

