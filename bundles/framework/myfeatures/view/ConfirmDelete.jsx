import React from 'react';
import { showModal } from 'oskari-ui/components/window';
import { PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../constants';
import styled from 'styled-components';

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 1em;
    padding: 0.5em;
`;

export const confirmDelete = (okCallback, onClose) => {
    return showModal(
        <Message bundleKey={BUNDLE_KEY} messageKey={'featureEditor.confirmDelete'}/>,
        <Container>
            <SecondaryButton type='cancel' onClick={onClose}/>
            <PrimaryButton type='yes' onClick={okCallback}/>
        </Container>,
        onClose
    );
}