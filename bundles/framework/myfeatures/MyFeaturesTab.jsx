import React from 'react';
import PropTypes from 'prop-types';
import { MyFeaturesList } from './MyFeaturesList';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from './constants';
import { Button, Message } from 'oskari-ui';
import { ButtonContainer } from 'oskari-ui/components/buttons';

export const MyFeaturesTab = ({ controller, state }) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Message messageKey='featureEditor.featureLayer.tableInfoText'/>
            <ButtonContainer>
                <Button type='primary' onClick={() => controller.showLayerDialog({ isNew: true})}>
                    <Message messageKey='featureEditor.featureLayer.new'/>
                </Button>
            </ButtonContainer>

            <MyFeaturesList
                controller={controller}
                data={state.data}
                selectedLayerIds={state.selectedLayerIds}
                loading={state.loading}
            />
        </LocaleProvider>
    );
};

MyFeaturesTab.tabSortOrder = 40;

MyFeaturesTab.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
