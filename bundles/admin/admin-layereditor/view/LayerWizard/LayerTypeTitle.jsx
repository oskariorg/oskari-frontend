
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';

export const LayerTypeTitle = ({ layer, LabelComponent }) => (
    <Fragment>
        <Message messageKey='wizard.type' LabelComponent={LabelComponent} />
        { layer.type &&
            <Fragment>
                <span>:</span>
                <div><Message messageKey={`layertype.${layer.type}`} defaultMsg={layer.type} /></div>
            </Fragment>
        }
    </Fragment>
);
LayerTypeTitle.propTypes = {
    layer: PropTypes.object.isRequired,
    LabelComponent: PropTypes.elementType
};
