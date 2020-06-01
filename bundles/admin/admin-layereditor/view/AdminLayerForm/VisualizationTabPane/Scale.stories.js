import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { Scale } from './Scale';

import '../../../../../../src/global';

function getMessage () {
    return 'No restriction';
}

function getController (state, setState) {
    return {
        setMinAndMaxScale: ([minscale, maxscale]) => {
            setState({
                minscale,
                maxscale
            });
        }
    };
}

const scales = [5805343, 2902671, 1451336, 725668, 362834, 181417, 90708, 45354, 22677, 11339, 5669, 2835, 1417, 709];

function Parent ({ children, ...props }) {
    const [state, setState] = useState();
    return <div>{children(state, setState)}</div>;
}
Parent.propTypes = {
    children: PropTypes.any.isRequired
};

storiesOf('Scale', module)
    .add('without text', () => {
        return (
            <Parent>
                {(state = {}, setState) => (
                    <React.Fragment>
                        <Scale layer={state} scales={scales} controller={getController(state, setState)} getMessage={getMessage} />
                        Scales: { JSON.stringify(scales) }
                        <pre>State:
                            { JSON.stringify(state, null, 2) }
                        </pre>
                    </React.Fragment>
                )}
            </Parent>
        );
    });
