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
        {<Message bundleKey={'FeatureEditor'} messageKey={'FeatureEditorView.buttons.yes'}/>}
    </Button>);
    notification.open({
        message: <Message bundleKey={'FeatureEditor'} messageKey={'FeatureEditorView.editConfirm.title'}/>,
        description: <Message bundleKey={'FeatureEditor'} messageKey={'FeatureEditorView.editConfirm.msg'}/>,
        btn: confirmBtn,
        key
    });
};

