import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Divider } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { FeatureFilter, cleanFilter } from 'oskari-ui/components/FeatureFilter';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { Controller } from 'oskari-ui/util';

export const OptionalStyleModal = ({ vectorStyle, styleTabs, controller, onClose, properties = [] }) => {
    // For now supports only one optional style
    // TODO: figure out how existing styles is listed
    const { featureStyle, optionalStyles = [] } = vectorStyle?.style || {};
    const { property, AND, OR, ...styleDef } = optionalStyles[0] || {};
    const [filter, setFilter] = useState({ property, AND, OR });
    const [optStyle, setStyle] = useState(styleDef);
    // TODO: store only changed/overrided defs to optional??
    // like { image: {shape: 2 }}
    // now editor sets whole style to optStyle
    const onModalOk = () => {
        const cleaned = cleanFilter(filter);
        if (!Object.keys(cleaned).length) {
            // doesn't have valid filter
            return;
        }
        const toSave = {
            ...vectorStyle,
            style: { 
                featureStyle,
                optionalStyles: [{ ...cleaned, ...optStyle }]
            }
        };
        controller.saveVectorStyleToLayer(toSave, true);
        onClose();
    };
    return (
        <Modal
            destroyOnClose
            mask={ false }
            maskClosable= { false }
            open={ vectorStyle && properties.length > 0 }
            onOk={ onModalOk }
            onCancel={ onClose }
            cancelText={ <Message messageKey="cancel" /> }
            okText={ <Message messageKey="save" /> }
            width={ 700 }>
            <h3><Message messageKey='styles.vector.optionalStyles' /></h3>
            <FeatureFilter onChange={setFilter} filter={filter}
                types={properties} properties={properties.map(p => p.name)}/>
            <Divider>
                <Message messageKey='styles.vector.featureStyle' />
            </Divider>
            <StyleEditor tabs={styleTabs}
                oskariStyle={ Object.keys(optStyle).length ? optStyle : featureStyle }
                onChange={setStyle}/>
        </Modal>
    );
};

OptionalStyleModal.propTypes = {
    vectorStyle: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired,
    onClose: PropTypes.func.isRequired,
    properties: PropTypes.array
};
