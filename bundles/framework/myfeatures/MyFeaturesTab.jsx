import React from 'react';
import PropTypes from 'prop-types';
import { MyFeaturesList } from './MyFeaturesList';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from './constants';

export const MyFeaturesTab = ({ controller, state }) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <MyFeaturesList
                controller={controller}
                data={state.data}
                loading={state.loading}
            />
        </LocaleProvider>
    );
};

MyFeaturesTab.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
