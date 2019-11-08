import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LayerIcon } from '../../../LayerIcon';
import { VisibilityInfo } from './VisibilityInfo';
import { OpacitySlider } from './OpacitySlider';
import { StyleSettings } from './StyleSettings';
import { ToolMenu } from './ToolMenu';
import { Mutator } from 'oskari-ui/util';
import { Row, ColAuto, ColAutoRight } from '../Grid';

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

const getVisibilityInfoProps = ({ layer, visibilityInfo, locale, mutator }) => {
    const { unsupported, visible, inScale, geometryMatch } = visibilityInfo;
    if (!visible) {
        return {
            text: locale.layer.hidden
        };
    }
    if (unsupported) {
        return {
            action: unsupported.getAction(),
            text: unsupported.getActionText() || unsupported.getDescription() || ''
        };
    }
    if (!inScale || !geometryMatch) {
        return {
            action: () => mutator.locateLayer(layer),
            text: inScale ? locale.layer.moveToContentArea : locale.layer.moveToScale
        };
    }
};

export const Footer = ({ locale, layer, mutator, visibilityInfo }) => {
    const [slider, setSlider] = useState(layer.getOpacity());
    const handleOpacityChange = value => {
        setSlider(value);
        mutator.changeOpacity(layer, value);
    };
    const tools = layer.getTools();
    const layerType = layer.getLayerType();
    const visibilityInfoProps = getVisibilityInfoProps({ locale, layer, mutator, visibilityInfo });
    return (
        <GrayRow>
            <ColAuto>
                <LayerIcon type={layerType} />
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
                            value={slider}
                            onChange={handleOpacityChange}
                        />
                    </ColAuto>
                    <ColAuto>
                        <StyleSettings
                            layer={layer}
                            locale={locale}
                            onChange={styleName => mutator.changeLayerStyle(layer, styleName)}
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
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    visibilityInfo: PropTypes.object.isRequired
};
