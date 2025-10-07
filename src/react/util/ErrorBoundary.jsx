import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WarningOutlined } from '@ant-design/icons';
import { getMsg } from './locale';

export const getGenericMsg = () => getMsg('error.generic');

const ErrorTag = styled('h2')`
    color: red;
`;
const DefaultError = () => (
    <ErrorTag>
        <WarningOutlined /> {getGenericMsg()}
    </ErrorTag>);
/**
 * Usage:
 * 1) Wrap components to "try/catch" with:
 *
 *     import { ErrorBoundary } from 'oskari-ui/util';
 *     <ErrorBoundary> .. the usual JSX ... </ErrorBoundary>
 *
 * 2) (optional) Create custom error handler to show when error happens on wrapped components:
 *
 *      export const CustomError = ({info}) => {
 *          console.log(info);
 *          return (<b>BOOM!</b>);
 *      };
 *
 * 3) (optional) Pass custom error element for customizing the error display:
 *
 *     import {CustomError} from './CustomError';
 *     <ErrorBoundary errorComponent={CustomError}>
 *
 * 4) See more:
 * - https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.errorComp = props.errorComponent;
        this.hideError = !!props.hide;
        this.debugInfo = props.debug;
        this.state = { hasError: false };
    }

    componentDidCatch (error, errorInfo) {
        const log = Oskari.log('React/ErrorBoundary');
        log.error(error);
        if (this.debugInfo) {
            log.info('Debug info', this.debugInfo);
        }
        this.setState({
            hasError: true,
            errorInfo });
    }

    render () {
        if (this.state.hasError) {
            if (this.hideError) {
                return null;
            }
            const ErrorComp = this.errorComp || DefaultError;
            return (<ErrorComp info={this.state.errorInfo}/>);
        }
        return this.props.children;
    }
}
ErrorBoundary.propTypes = {
    // boolean to just skip without showing an error
    hide: PropTypes.bool,
    // info to include in logging if an error occurs
    debug: PropTypes.object,
    // custom component for rendering an error message
    errorComponent: PropTypes.elementType,
    // children are rendered when there is no error
    children: PropTypes.any
};
