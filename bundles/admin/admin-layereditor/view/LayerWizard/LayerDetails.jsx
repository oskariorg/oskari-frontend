import React from 'react';
import PropTypes from 'prop-types';

export class LayerDetails extends React.Component {
    render () {
        return (
            <div>
                Selected: {this.props.layer && JSON.stringify(this.props.layer)}
            </div>
        );
    }
}

LayerDetails.propTypes = {
    layer: PropTypes.object
};
