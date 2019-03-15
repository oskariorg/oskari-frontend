import React from 'react';
import {withContext} from '../../../../../src/react/util.jsx';
import './legend.scss';

const getNoActiveElem = text => {
    return (
        <div className="legend-noactive">
            {text}
        </div>
    );
};

const Legend = ({legendHTML}) => {
    if (legendHTML.__html) {
        return (
            <div className="active-legend" dangerouslySetInnerHTML={legendHTML}/>
        );
    } else if (legendHTML.error) {
        return getNoActiveElem(legendHTML.error);
    }
    return getNoActiveElem('');
};

const contextWrapped = withContext(Legend);
export {contextWrapped as Legend};
