import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';

export const shapes = {
    stateful: PropTypes.shape({
        state: PropTypes.object.isRequired,
        controller: PropTypes.instanceOf(Controller).isRequired
    })
};
