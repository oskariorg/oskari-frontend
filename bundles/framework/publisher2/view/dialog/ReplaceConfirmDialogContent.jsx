import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { ButtonContainer, DialogContentContainer } from './Styled';
import { LocaleProvider } from 'oskari-ui/util';

export const ReplaceConfirmDialogContent = ({ okCallback, closeCallback }) => {
    return <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
        <DialogContentContainer>
            <Message messageKey='BasicView.confirm.replace.msg'/>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={closeCallback}/>
                <Button type='primary' onClick={okCallback}>
                    <Message messageKey='BasicView.buttons.replace'/>
                </Button>
            </ButtonContainer>
        </DialogContentContainer>
    </LocaleProvider>;
};

ReplaceConfirmDialogContent.propTypes = {
    okCallback: PropTypes.func,
    closeCallback: PropTypes.func
};
