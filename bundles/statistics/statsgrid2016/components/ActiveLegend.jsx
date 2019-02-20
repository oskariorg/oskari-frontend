import React from 'react';
import { withContext } from '../../../../src/reactUtil/genericContext';

const getNoActiveElem = text => {
    return (
        <div className="legend-noactive">
            {text}
        </div>
    );
};

const ActiveLegend = ({legendHTML}) => {
    if (legendHTML.__html) {
        return (
            <div className="active-legend">
                <div dangerouslySetInnerHTML={legendHTML} />
            </div>
        );
    } else if (legendHTML.error) {
        return getNoActiveElem(legendHTML.error);
    }
    return getNoActiveElem('');
};

export default withContext(ActiveLegend);
