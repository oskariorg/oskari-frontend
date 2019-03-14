import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from './Collapse';
import { ListComponent } from '../../../../admin/admin-layereditor/components/List';
import { Layer } from './Layer';

const getLayers = group => group.getLayers().map((lyr, key) => <Layer model={lyr} key={key}/>);

function LayerList (props) {
    if (!Array.isArray(props.groups) || props.groups.length === 0) {
        return 'NO LAYER GROUPS';
    }
    const panels = props.groups.map(group => {
        return {
            header: group.name,
            extra: `${group.getLayers().length}`,
            content: <ListComponent dataSource={getLayers(group)}/>
        };
    });
    const collapseProps = {
        panels,
        accordion: true,
        bordered: false
    };
    return <Collapse {...collapseProps} />;
}

LayerList.propTypes = {
    groups: PropTypes.array,
    filterKeyword: PropTypes.string
};

const memorized = memo(LayerList);
export { memorized as LayerList };
