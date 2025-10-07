import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Controller } from 'oskari-ui/util';
import { LayerBox } from './LayerBox/';

// Ensuring the whole list does not re-render when the droppable re-renders
const Layers = React.memo(({ layers, ...rest }) => (
    layers.map((layer, index) => {
        return <LayerBox key={layer.getId()} layer={layer} index={index} {...rest} />;
    })
));
Layers.displayName = 'Layers';

Layers.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const reorder = (result, controller) => {
    if (!result.destination) {
        return;
    }
    controller.reorderLayers(result.source.index, result.destination.index);
};

export const SelectedLayers = ({ layers, controller }) => (
    <DragDropContext onDragEnd={result => reorder(result, controller)}>
        <Droppable droppableId="layers">
            {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Layers layers={layers} controller={controller} />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);

SelectedLayers.propTypes = {
    layers: Layers.propTypes.layers,
    controller: PropTypes.instanceOf(Controller).isRequired
};
