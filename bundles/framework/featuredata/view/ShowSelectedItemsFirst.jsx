import React from 'react';
import { Switch } from 'oskari-ui/components/Switch';
import { Message } from 'oskari-ui';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SelectedItemsFirstContainer = styled('div')`
    padding: 0 1em 0 0;
`;
export const ShowSelectedItemsFirst = (props) => {
    return <SelectedItemsFirstContainer>
        <Switch
            size={'small'}
            label={<Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='showSelectedFirst'/>}
            checked={ props.showSelectedFirst }
            defaultChecked = { false }
            onChange={ () => { props.toggleShowSelectedFirst(); } }/>
    </SelectedItemsFirstContainer>;
};
ShowSelectedItemsFirst.propTypes = {
    showSelectedFirst: PropTypes.bool,
    toggleShowSelectedFirst: PropTypes.func
};
