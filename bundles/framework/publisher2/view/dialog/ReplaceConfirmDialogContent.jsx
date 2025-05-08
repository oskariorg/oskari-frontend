import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { ButtonContainer, DialogContentContainer } from './Styled';
import { showModal } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from '../../constants';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-confirm'
};

const ReplaceConfirmDialogContent = ({ onConfirm, onClose }) => {
    return <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
        <DialogContentContainer>
            <Message messageKey='BasicView.confirm.replace.msg'/>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onClose}/>
                <Button type='primary' onClick={onConfirm}>
                    <Message messageKey='BasicView.buttons.replace'/>
                </Button>
            </ButtonContainer>
        </DialogContentContainer>
    </LocaleProvider>;
};

ReplaceConfirmDialogContent.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export const showReplacePopup = (onConfirm, onClose) => {
    return showModal(
        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.confirm.replace.title' />,
        <ReplaceConfirmDialogContent onConfirm={onConfirm} onClose={onClose}/>,
        onClose,
        POPUP_OPTIONS
    );
};
