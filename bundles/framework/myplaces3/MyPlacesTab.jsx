import React from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'oskari-ui/util';
import { LOCALE_KEY } from './constants';
import { MyPlacesList } from './MyPlacesList';
import { MyPlacesLayerControls } from './MyPlacesLayerControls';

export const MyPlacesTab = ({ state, controller }) => {
    return (
        <LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
            <MyPlacesLayerControls { ...state } controller={controller} />
            <MyPlacesList data={state.places} loading={state.loading} controller={controller} />
        </LocaleProvider>
    );
};

MyPlacesTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
