import React from 'react';
import PropTypes from 'prop-types';
import { UserLayersList } from './UserLayersList';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_KEY = 'MyPlacesImport';

export const UserLayersTab = ({ controller, state }) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <UserLayersList
                controller={controller}
                data={state.data}
            />
        </LocaleProvider>
    )
};

UserLayersTab.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
