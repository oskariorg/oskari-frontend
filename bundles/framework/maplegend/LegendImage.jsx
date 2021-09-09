import React, { Fragment, useState } from 'react';
import { Message } from 'oskari-ui';
import PropTypes from 'prop-types';

export const LegendImage = ({ item }) => {
    const [imageState, setImageState] = useState({
        hasError: false
    });

    return (
        <Fragment>
            { imageState.hasError
                ? <Message messageKey='invalidLegendUrl' />
                : <img
                    onError={ () => setImageState({ hasError: true }) }
                    src={ item.legendImageURL }
                />
            }
        </Fragment>
    );
};

LegendImage.propTypes = {
    item: PropTypes.any
};
