import { Mutator } from './Mutator';

/**
 * An easy way to add Mutator to an UIService. Adds getMutator function to the UIService.
 * The mixin takes Mutator constructor parameters as parameter.
 *
 * @mixin mutatorMixin
 * @mixes Mutator
 * @example
 * // LoadingHandler.js
 * class LoadingHandler extends StateHandler {
 *      setLoading (loading) {
 *          this.updateState({ loading });
 *      }
 * };
 * export const LoadingHandler = mutatorMixin(UIService, ['setLoading']);
 *
 * // LoadingButton.jsx
 * export const LoadingButton = ({loading, mutator}) => (
 *     <div>
 *         { loading && <Spin /> }
 *         <Button onClick={() => mutator.setLoading(!loading)}>
 *     </div>
 * );
 *
 * // View.js
 * export class View {
 *     constructor () {
 *         this.loadingHandler = new LoadingHandler();
 *         this.loadingHandler.addStateListener(() => this.render());
 *     }
 *     render () {
 *         const state = this.loadingHandler.getState();
 *         const mutator = this.loadingHandler.getMutator();
 *         ReactDom.render(<LoadingButton loading={state.loading} mutator={mutator} />, document);
 *     }
 * }
 */
export const mutatorMixin = (UIService, functionNames = []) => {
    class MixedService extends UIService {
        constructor (...args) {
            super(...args);
            let methods = functionNames;
            if (!Array.isArray(methods) || methods.length === 0) {
                methods = [];
                Oskari.log().warn('Mutator does not have mutating methods!');
            }
            this.mutator = new Mutator(this, methods);
        }
        /**
         * @return {Mutator} Mutator for the service
         */
        getMutator () {
            return this.mutator;
        }
    }
    return MixedService;
};
