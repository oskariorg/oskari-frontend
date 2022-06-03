import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Message } from 'oskari-ui';
import { ButtonContainer } from 'oskari-ui/components/buttons';
import { PlusOutlined } from '@ant-design/icons';

export const FlyoutFooter = ({
    toolController
}) => {
    return (
        <Fragment>
            <ButtonContainer>
                <Tooltip title={<Message messageKey={'tools.add'}/>}>
                    <Button type='primary' onClick={() => toolController.showEditPopup()} className='t_button-add' >
                        <PlusOutlined/>
                    </Button>
                </Tooltip>
            </ButtonContainer>
        </Fragment>
    );
};
FlyoutFooter.propTypes = {
    toolController: PropTypes.any.isRequired
};
