import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Divider, Collapse, CollapsePanel } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { FeatureFilter, cleanFilter, getDescription } from 'oskari-ui/components/FeatureFilter';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { IconButton } from 'oskari-ui/components/buttons';
import { Controller, Messaging } from 'oskari-ui/util';

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    & Button {
        z-index: 20;
    }
`;

// Modal.closeIcon: Custom close icon. 5.7.0: close button will be hidden when setting to null or false
// workaround to hide close icon. Also Header button has z-index to render it above close icon
const Hidden = styled.div`
    width: 54px;
    height: 54px;
    cursor: default;
`;

const Header = ({ onAdd }) => (
    <HeaderContainer>
        <Message messageKey='styles.vector.optionalStyles' />
        <IconButton bordered type='add' onClick={onAdd} />
    </HeaderContainer>
);

const PanelExtra = ({ onRemove}) => {
    return (
        <div onClick={e => e.stopPropagation()}>
            <IconButton type='delete' onClick={onRemove}/>
        </div>
    );
};

export const OptionalStyleModal = ({ vectorStyle, geometryType, controller, onClose, properties = [] }) => {
    const { featureStyle, optionalStyles = [] } = vectorStyle?.style || {};
    const [ styles, setStyles ] = useState(optionalStyles.length ? optionalStyles : [{}]);

    // TODO: store only changed/overrided defs to optional??
    // like { image: {shape: 2 }}
    // now editor sets whole style to optStyle
    const save = () => {
        const optionalStyles = styles.map(optStyle => {
            const { property, AND, OR, ...styleDef } = optStyle;
            const cleaned = cleanFilter({ property, AND, OR }, properties);
            if (!cleaned) {
                // doesn't have valid filter
                Messaging.error(<Message messageKey='styles.vector.validation.optionalStyles' bundleKey='admin-layereditor'/>);
                return;
            }
            return { ...cleaned, ...styleDef };
        }).filter(a => a);

        if (styles.length !== optionalStyles.length) {
            // don't store and keep editor visible
            return;
        }
        const toSave = {
            ...vectorStyle,
            style: { featureStyle, optionalStyles }
        };
        controller.saveVectorStyleToLayer(toSave, true);
        onClose();
    };
    const update = (style, index) => {
        setStyles(styles.map((s,i) => i === index ? style : s));
    };
    const remove = index => {
        setStyles(styles.filter((s, i) => i !== index));
    };
    const add = () => setStyles([...styles, {}]);
    const propertyNames = properties.map(p => p.name);
    return (
        <Modal
            destroyOnClose
            mask={ false }
            maskClosable= { false }
            open={ vectorStyle && properties.length > 0 }
            onOk={ save }
            onCancel={ onClose }
            cancelText={ <Message messageKey="cancel" /> }
            okText={ <Message messageKey="save" /> }
            title={<Header onAdd={add} />}
            closeIcon={<Hidden onClick={e => e.stopPropagation()}/>}
            width={ 800 }>
            <Collapse accordion>
                { styles.map((optStyle, i) => {
                    const { property, AND, OR, ...styleDef } = optStyle;
                    const filterDef = { property, AND, OR }; // TODO: sets undefined values, ok??
                    return (
                        <CollapsePanel key={`style_${i}`}
                            header={getDescription(filterDef)}
                            extra={<PanelExtra onRemove={() => remove(i)}/>}>
                            <Divider><Message messageKey='styles.vector.optionalStylesFilter' /></Divider>
                            <FeatureFilter filter={filterDef} types={properties} properties={propertyNames}
                                onChange={ updated => update({ ...styleDef, ...updated }, i)}/>
                            <Divider><Message messageKey='styles.vector.featureStyle' /></Divider>
                            <StyleEditor geometryType={geometryType}
                                oskariStyle={ Object.keys(styleDef).length ? styleDef : featureStyle }
                                onChange={updated => update({ ...filterDef, ...updated }, i)}/>
                        </CollapsePanel>
                    )})
                }
            </Collapse>
        </Modal>
    );
};

OptionalStyleModal.propTypes = {
    vectorStyle: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired,
    onClose: PropTypes.func.isRequired,
    properties: PropTypes.array
};
