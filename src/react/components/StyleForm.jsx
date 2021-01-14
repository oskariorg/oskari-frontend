import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleEditor, StyleSelector } from 'oskari-ui';
import { Card } from 'antd';

import { StyleFormHandler } from './styleform/StyleFormHandler';

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

    const formHandler = new StyleFormHandler(props.styleSettings);
    console.log('rendering whole form');

    return (
        <Card>
            <StyleSelector
                styleList={ props.styleList }
                onChange={ (selected) => formHandler.setFormState({ ...selected }) }
                locSettings={ locSettings }
            />
            <StyleEditor
                styleSettings={ formHandler.getCurrentStyle() }
                format={ formHandler.getCurrentFormat() }
                locSettings={ locSettings }
                formHandler={ formHandler }
                onChange={ (values) => formHandler.setFormState(values) }
            />
        </Card>
    );
};

StyleForm.propTypes = {
    styleList: PropTypes.array.isRequired
};
