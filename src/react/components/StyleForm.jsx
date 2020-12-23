import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleEditor, StyleSelector } from 'oskari-ui';
import { Card } from 'antd';

const locSettings = {
    localeKey: 'oskariui'
};

/**
 * @class StyleForm
 * @calssdesc <StyleForm>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 *
 * @example <caption>Basic usage</caption>
 * <StyleForm props={{ ...exampleProps }}/>
 */

export const StyleForm = (props) => {
    // initialize state with propvided style settings to show preview correctly and set default format as point
    const [state, setState] = useState({
        ...props.styleSettings
    });

    
    let style = props.styleSettings;
    // STATE EI MENE OIKEIN

    useEffect(() => {
        console.log(state);
        //setState({ ...style })
     });
     
    return (
        <Card>
            <StyleSelector
                styleList={ props.styleList }
                onChange={ (selected) => style = selected }
                locSettings={ locSettings }
            />
            <StyleEditor
                icons={ props.icons }
                styleList={ props.styleList }
                markers={ props.markers }
                styleSettings={ state }
                lineIcons={ props.lineIcons }
                locSettings={ locSettings }
            />
        </Card>
    );
};
