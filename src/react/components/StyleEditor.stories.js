import React from 'react';
import { storiesOf } from '@storybook/react';
import { Card } from 'antd';
import { StyleEditor } from './StyleEditor';
import { StyleSelector } from './StyleEditor/StyleSelector';

import '../../global';
import '../../../bundles/framework/oskariui/resources/locale/fi';
import '../../../bundles/framework/oskariui/resources/locale/en';
import '../../../bundles/framework/oskariui/resources/locale/sv';

Oskari.setSupportedLocales(['en_US', 'fi_FI', 'sv_SE']);
Oskari.setLang('en');

console.clear();

storiesOf('StyleEditor', module)
    .add('Default', () => {
        const [currentStyle, setCurrentStyle] = React.useState(oskariTestStyle);
        const onStyleSelection = (style) => setCurrentStyle(getStyleByName(style));
        return (
            <Card>
                <StyleSelector
                    styleList={ getStyleNames() }
                    onChange={ onStyleSelection }
                />
                <StyleEditor
                    oskariStyle={ currentStyle }
                    onChange={ (values) => setCurrentStyle(values) }
                />
            </Card>
        );
    });

/* **********************************************
 * Helper functions and test data
 * ********************************************** */
const getStyleByName = (selectedStyleName) => styleList.find((style) => style.name === selectedStyleName).oskariStyle;
const getStyleNames = () => styleList.map(item => item.name);
const oskariTestStyle = {
    fill: { // fill styles
        color: '#b5b5b5', // fill color
        area: {
            pattern: 'solid' // fill style - original default: -1
        }
    },
    stroke: { // stroke styles
        color: '#000000', // stroke color
        width: 3, // stroke width
        lineDash: 'solid', // line dash, supported: dash, dashdot, dot, longdash, longdashdot and solid
        lineCap: 'round', // line cap, supported: mitre, round and square
        area: {
            color: '#000000', // area stroke color
            width: 3, // area stroke width
            lineDash: 'solid', // area line dash
            lineJoin: 'round' // area line corner
        }
    },
    text: { // text style
        fill: { // text fill style
            color: '#000000' // fill color
        },
        stroke: { // text stroke style
            color: '#ffffff', // stroke color
            width: 1 // stroke width
        },
        font: 'bold 12px Arial', // font
        textAlign: 'top', // text align
        offsetX: 12, // text offset x
        offsetY: 12, // text offset y
        labelText: 'example', // label text
        labelProperty: 'propertyName' // read label from feature property
    },
    image: { // image style
        shape: 5, // 0-6 for default markers. svg or external icon path
        size: 3, // Oskari icon size.
        sizePx: 20, // Exact icon px size. Used if 'size' not defined.
        offsetX: 0, // image offset x
        offsetY: 0, // image offset y
        opacity: 0.7, // image opacity
        radius: 2, // image radius
        fill: {
            color: '#ff00ff' // image fill color
        }
    },
    inherit: false, // For hover. Set true if you wan't to extend original feature style.
    effect: 'auto normal' // Requires inherit: true. Lightens or darkens original fill color. Values [darken, lighten, auto] and [minor, normal, major].
};

const styleList = [
    {
        name: 'testi tyyli ff',
        format: 'point',
        oskariStyle: {
            fill: {
                color: '#c5c5c5',
                area: {
                    pattern: 'solid'
                }
            },
            stroke: {
                color: '#008720',
                width: 3,
                lineDash: 'solid',
                lineCap: 'round',
                area: {
                    color: '#008720',
                    width: 3,
                    lineDash: 'solid',
                    lineJoin: 'round'
                }
            },
            image: {
                shape: 2,
                size: 4,
            }
        }
    },
    {
        name: 'tyyli 2',
        format: 'line',
        oskariStyle: {
            fill: {
                color: '#c5c5c5',
                area: {
                    pattern: 'solid'
                }
            },
            stroke: {
                color: '#88f8c2',
                width: 3,
                lineDash: 'solid',
                lineCap: 'round',
                area: {
                    color: '##88ffc9',
                    width: 3,
                    lineDash: 'solid',
                    lineJoin: 'round'
                }
            },
            image: {
                shape: 2,
                size: 4,
            }
        }
    },
    {
        name: 'storybooktyyli',
        format: 'area',
        oskariStyle: {
            fill: {
                color: '#4600b0',
                area: {
                    pattern: 'line2'
                }
            },
            stroke: {
                color: '#78a300',
                width: 3,
                lineDash: 'solid',
                lineCap: 'round',
                area: {
                    color: '#622eff',
                    width: 1,
                    lineDash: 'solid',
                    lineJoin: 'round'
                }
            },
            image: {
                shape: 2,
                size: 4,
            }
        }
    }
];
