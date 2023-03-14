import React from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'oskari-ui/util';
import { UserStylesList } from './UserStylesTab/UserStylesList';
import { BUNDLE_KEY } from '../constants';

export const UserStylesTab = ({ state, controller }) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <UserStylesList data={state.styles} loading={state.loading} controller={controller} />
        </LocaleProvider>
    );
};

UserStylesTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
