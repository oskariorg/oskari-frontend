import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'oskari-ui';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { ButtonContainer, DialogContentContainer } from './Styled';

export const ReplaceConfirmDialogContent = ({ message, replaceButtonTitle, okCallback, closeCallback }) => {
    return <DialogContentContainer>
        {message}
        <ButtonContainer>
            <SecondaryButton type='cancel' onClick={closeCallback}/>
            <Button type='primary' onClick={okCallback}>{replaceButtonTitle}</Button>
        </ButtonContainer>
    </DialogContentContainer>;
};

ReplaceConfirmDialogContent.propTypes = {
    message: PropTypes.string,
    okCallback: PropTypes.func,
    closeCallback: PropTypes.func,
    replaceButtonTitle: PropTypes.string
};
