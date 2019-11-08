import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LayerInfoBox, LayerScaleLocateBox } from './LayerInfoBox';
import { LayerIcon } from '../../LayerIcon';
import { StyleSettings } from './StyleSettings';
import { Icon, Dropdown, Menu } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { Row, ColAuto, ColAutoRight } from './Grid';
import { THEME_COLOR } from '.';

const GrayRow = styled(Row)`
    background-color: #f3f3f3;
    padding-left: 60px;
    justify-content: flex-start;
    ${ColAuto}, ${ColAutoRight} {
        display: flex;
        align-items: center;
        padding-left: 0;
        > :not(:last-child) {
            margin-right: 5px;
        }
    }
`;

const SelectedLayerDropdown = ({ tools }) => {
    const items = tools.map(tool => {
        return { title: tool._title ? tool._title : tool._name, action: () => true };
    });
    const menu = <Menu items={items} />;
    return (
        <Dropdown menu={menu} placement="bottomRight">
            <Icon type="more" style={{ color: THEME_COLOR, fontSize: '24px' }} />
        </Dropdown>
    );
};

SelectedLayerDropdown.propTypes = {
    tools: PropTypes.array.isRequired
};

export const LayerBoxFooter = ({ locale, layer, mutator, visibilityInfo }) => {
    const [slider, setSlider] = useState(layer.getOpacity());
    const tools = layer.getTools();
    const isInScale = layer.isInScale();
    const geometryMatch = visibilityInfo.geometryMatch;
    const layerType = layer.getLayerType();
    const handleOpacityChange = value => {
        setSlider(value);
        mutator.changeOpacity(layer, value);
    };
    const handleLocateScaleLayer = () => {
        mutator.locateLayer(layer);
    };
    return (
        <GrayRow>
            <ColAuto>
                <LayerIcon type={layerType} />
            </ColAuto>
            {!isInScale &&
                <LayerScaleLocateBox
                    handleClick={handleLocateScaleLayer}
                    text={locale.layer.moveToScale}
                />
            }
            {(!geometryMatch && isInScale) &&
                <LayerScaleLocateBox
                    handleClick={handleLocateScaleLayer}
                    text={locale.layer.moveToContentArea}
                />
            }
            {isInScale && geometryMatch &&
                <Fragment>
                    <LayerInfoBox
                        slider={slider}
                        handleOpacityChange={handleOpacityChange}
                    />
                    <StyleSettings
                        layer={layer}
                        locale={locale}
                        mutator={mutator}
                        onChange={styleName => mutator.changeLayerStyle(layer, styleName)}
                    />
                </Fragment>
            }
            <ColAutoRight>
                <SelectedLayerDropdown tools={tools} />
            </ColAutoRight>
        </GrayRow>
    );
};

LayerBoxFooter.propTypes = {
    layer: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    visibilityInfo: PropTypes.object.isRequired
};
