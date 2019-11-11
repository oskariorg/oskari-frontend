import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Mutator } from 'oskari-ui/util';
import { LayerBox } from './LayerBox/';

// Ensuring the whole list does not re-render when the droppable re-renders
const Layers = React.memo(({ layers, visibilityInfo, ...rest }) => (
    layers.map((layer, index) => {
        const visibilityCheck = visibilityInfo.find(v => v.id === layer.getId());
        return <LayerBox key={layer.getId()} layer={layer} index={index} visibilityInfo={visibilityCheck} {...rest} />;
    })
));
Layers.displayName = 'Layers';

Layers.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    visibilityInfo: PropTypes.arrayOf(PropTypes.object)
};

const reorder = (result, mutator) => {
    if (!result.destination) {
        return;
    }
    mutator.reorderLayers(result.source.index, result.destination.index);
};

export const SelectedLayers = ({ layers, locale, mutator, visibilityInfo }) => (
    <DragDropContext onDragEnd={result => reorder(result, mutator)}>
        <Droppable droppableId="layers">
            {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Layers layers={layers} locale={locale} mutator={mutator} visibilityInfo={visibilityInfo} />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);

SelectedLayers.propTypes = {
    layers: Layers.propTypes.layers,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    visibilityInfo: PropTypes.arrayOf(PropTypes.object)
};
