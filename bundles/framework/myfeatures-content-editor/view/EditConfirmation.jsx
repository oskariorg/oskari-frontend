import React from 'react';
import { notification } from 'antd';
import { Button } from 'oskari-ui';

export const confirmEdit = (getMessage, onConfirm) => {
    const key = `open${Date.now()}`;
    const confirmBtn = (<Button
        type="primary"
        onClick={() => {
            onConfirm(true);
            notification.destroy(key);
        }}>
        {getMessage('ContentEditorView.buttons.yes')}
    </Button>);
    notification.open({
        message: getMessage('ContentEditorView.editConfirm.title'),
        description: getMessage('ContentEditorView.editConfirm.msg'),
        btn: confirmBtn,
        key
    });
};

