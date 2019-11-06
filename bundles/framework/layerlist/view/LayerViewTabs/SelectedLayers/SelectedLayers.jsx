import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Mutator } from 'oskari-ui/util';
import { LayerBox } from './LayerBox';

// Ensuring the whole list does not re-render when the droppable re-renders
const Layers = React.memo(({ layers, mutator }) => (
    layers.map((layer, index) => <LayerBox key={layer.getId()} layer={layer} index={index} mutator={mutator} />)
));
Layers.displayName = 'Layers';

Layers.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};

const reorder = (result, mutator) => {
    if (!result.destination) {
        return;
    }
    mutator.reorderLayers(result.source.index, result.destination.index);
};

export const SelectedLayers = ({ layers, mutator }) => (
    <DragDropContext onDragEnd={result => reorder(result, mutator)}>
        <Droppable droppableId="layers">
            {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Layers layers={layers} mutator={mutator} />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);

SelectedLayers.propTypes = {
    layers: Layers.propTypes.layers,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
