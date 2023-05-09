import React from 'react';
import { Checkbox } from 'oskari-ui/components/Checkbox';
import { Message } from 'oskari-ui';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SelectedItemsFirstContainer = styled('div')`
    padding-bottom: 0.5em;
`;
export const ShowSelectedItemsFirst = (props) => {
    return <SelectedItemsFirstContainer>
        <Checkbox checked={ props.showSelectedFirst } onChange={ () => { props.toggleShowSelectedFirst(); } }>
            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='showSelectedFirst'/>
        </Checkbox>
    </SelectedItemsFirstContainer>;
};
ShowSelectedItemsFirst.propTypes = {
    showSelectedFirst: PropTypes.bool,
    toggleShowSelectedFirst: PropTypes.func
};
