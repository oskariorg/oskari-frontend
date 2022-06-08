import React from 'react';
import PropTypes from 'prop-types';
import { MyIndicatorsList } from './MyIndicatorsList';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_KEY = 'StatsGrid';

export const MyIndicatorsTab = ({ state, controller }) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <MyIndicatorsList
                controller={controller}
                data={state.data}
                loading={state.loading}
            />
        </LocaleProvider>
    );
}

MyIndicatorsTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
}
