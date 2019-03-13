import React, { memo } from 'react';
import PropTypes from 'prop-types';

function LayerList (props) {
    const content = !Array.isArray(props.groups) || props.groups.length === 0
        ? 'NO LAYER GROUPS for keyword' + props.keyword
        : (
            <ul>
                {props.groups.map((group, i) => <li key={i}>{JSON.stringify(group)}</li>)}
            </ul>
        );

    return <div>{content}</div>;
}

LayerList.propTypes = {
    groups: PropTypes.Array,
    keyword: PropTypes.string
};

let memorized = memo(LayerList);
export { memorized as LayerList };
