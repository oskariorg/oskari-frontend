import React, { memo } from 'react';

const Groups = props => (
    <ul>
        {props.groups.map((group, i) => <li key={i}>{JSON.stringify(group)}</li>)}
    </ul>
);

function LayerList (props) {
    const isEmpty = !props.groups || props.groups.length === 0;
    const content = Array.isArray(props.groups) && props.length !== 0
        ? <Groups groups={props.groups}></Groups>
        : 'NO LAYER GROUPS for keyword' + props.keyword;
    
    return <div>{content}</div>
  }
  
  let memorized = memo(LayerList);
  export { memorized as LayerList };
