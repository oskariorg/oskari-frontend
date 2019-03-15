import React from 'react';
import { withContext } from '../../../../src/reactUtil/genericContext';
import '../resources/scss/activelegend.scss';

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
            <div className="active-legend" dangerouslySetInnerHTML={legendHTML}/>
        );
    } else if (legendHTML.error) {
        return getNoActiveElem(legendHTML.error);
    }
    return getNoActiveElem('');
};

const contextWrapped = withContext(ActiveLegend);
export {contextWrapped as ActiveLegend};
