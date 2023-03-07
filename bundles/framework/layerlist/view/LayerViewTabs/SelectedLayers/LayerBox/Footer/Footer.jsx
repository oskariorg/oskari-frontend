import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LayerIcon } from '../../../LayerIcon';
import { VisibilityInfo } from './VisibilityInfo';
import { OpacitySlider } from './OpacitySlider';
import { StyleSettings } from './StyleSettings';
import { ToolMenu } from './ToolMenu';
import { Controller } from 'oskari-ui/util';
import { Row, ColAuto, ColAutoRight } from '../Grid';

const GrayRow = styled(Row)`
    background-color: #f3f3f3;
    padding-left: 60px;
    justify-content: flex-start;
    ${ColAuto}, ${ColAutoRight} {
        display: flex;
        align-items: center;
        padding-left: 0;
        :nth-last-child(2) {
            padding-right: 0;
        }
        > :not(:last-child) {
            margin-right: 5px;
        }
    }
`;

const getVisibilityInfoProps = ({ layer, controller }) => {
    const { unsupported, visible, inScale, geometryMatch } = layer.getVisibilityInfo();
    if (!visible) {
        return {
            messageKey: 'layer.hidden'
        };
    }
    if (unsupported) {
        return {
            action: unsupported.getAction(),
            text: unsupported.getActionText() || unsupported.getDescription() || ''
        };
    }
    if (!inScale || !geometryMatch) {
        const zoomToExtent = !geometryMatch;
        return {
            action: () => controller.locateLayer(layer, zoomToExtent),
            messageKey: zoomToExtent ? 'layer.moveToContentArea' : 'layer.moveToScale'
        };
    }
};

export const Footer = ({ layer, controller }) => {
    const tools = layer.getTools();
    const opacity = layer.getOpacity();
    const layerType = layer.getLayerType();
    const visibilityInfoProps = getVisibilityInfoProps({ layer, controller });
    return (
        <GrayRow>
            <ColAuto>
                <LayerIcon type={layerType} hasTimeseries={layer.hasTimeseries()} />
            </ColAuto>
            {visibilityInfoProps &&
                <ColAuto>
                    <VisibilityInfo {...visibilityInfoProps}/>
                </ColAuto>
            }
            {!visibilityInfoProps &&
                <Fragment>
                    <ColAuto>
                        <OpacitySlider
                            value={opacity}
                            onChange={value => controller.changeOpacity(layer, value)}
                        />
                    </ColAuto>
                    <ColAuto>
                        <StyleSettings
                            layer={layer}
                            onChange={styleName => controller.changeLayerStyle(layer, styleName)}
                        />
                    </ColAuto>
                </Fragment>
            }
            <ColAutoRight>
                <ToolMenu tools={tools} />
            </ColAutoRight>
        </GrayRow>
    );
};

Footer.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
