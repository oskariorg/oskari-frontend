import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';

export const shapes = {
    stateful: PropTypes.shape({
        state: PropTypes.object.isRequired,
        mutator: PropTypes.instanceOf(Mutator).isRequired
    })
};
