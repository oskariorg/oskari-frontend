import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox, Divider } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { Controller } from 'oskari-ui/util';
import { AnnouncementsContent } from '../';

export const SingleContent = ({
    announcement,
    controller,
    dontShowAgain,
    onClose
}) => {
    const onCheckboxChange = (e) => controller.setShowAgain(announcement.id, e.target.checked);

    return (
        <Fragment>
            <AnnouncementsContent announcement={announcement}/>
            <Divider/>
            <ButtonContainer style={{ justifyContent: 'space-between' }}>
                <Checkbox checked={dontShowAgain} onChange={onCheckboxChange}>
                    <Message messageKey='dontShow'/>
                </Checkbox>
                <PrimaryButton type='close' onClick={() => onClose()}/>
            </ButtonContainer>
        </Fragment>
    );
};
SingleContent.propTypes = {
    announcement: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    dontShowAgain: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
