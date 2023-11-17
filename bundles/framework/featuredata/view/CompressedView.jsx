import React from 'react';
import { Switch } from 'oskari-ui/components/Switch';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import { Message } from 'oskari-ui';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CompressedViewContainer = styled('div')`
`;
export const CompressedView = (props) => {
    return <CompressedViewContainer>
        <Switch
            size={'small'}
            label={<Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='toggleCompressedView'/>}
            checked={ props.showCompressed }
            defaultChecked = { true }
            onChange={ () => { props.toggleShowCompressed(); } }/>
    </CompressedViewContainer>;
};
CompressedView.propTypes = {
    showCompressed: PropTypes.bool,
    toggleShowCompressed: PropTypes.func
};
