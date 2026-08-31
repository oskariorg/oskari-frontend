import React from 'react';
import { showModal } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { styled } from 'styled-components';

const Buttons = styled('div')`
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    justify-content: flex-end;
    margin-top: 1em;
`;

const Content = styled('div')`
    padding: 1em;
`;

export const confirmEdit = (getMessage, onConfirm) => {
    let controls = null;
    const close = () => {
        if (controls) {
            controls.close();
        }
    };
    const title = <Message bundleKey={'oskariui'} messageKey={'FeatureEditorView.editConfirm.title'}/>;
    const content = (
        <Content>
            <Message bundleKey={'oskariui'} messageKey={'FeatureEditorView.editConfirm.msg'}/>
            <Buttons>
                <PrimaryButton type='yes' onClick={() => { onConfirm(true); close(); }}/>
                <SecondaryButton type='cancel' onClick={close}/>
            </Buttons>
        </Content>
    );
    controls = showModal(title, content, close);
};

