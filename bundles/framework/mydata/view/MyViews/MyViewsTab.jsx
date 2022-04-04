import React from 'react';
import PropTypes from 'prop-types';
import { MyViewsList } from './MyViewsList';
import { Button, Message } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'PersonalData';

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`;

export const MyViewsTab = ({ controller, data }) => {

    return (
        <>
            <ButtonContainer>
                <Button type='primary' onClick={controller.saveCurrent}>
                    <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.button.saveCurrent' />
                </Button>
            </ButtonContainer>
            <MyViewsList
                controller={controller}
                data={data}
            />
        </>
    )
};

MyViewsTab.propTypes = {
    controller: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.object)
}
