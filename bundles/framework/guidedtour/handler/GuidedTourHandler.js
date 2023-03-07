import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showGuidedTourPopup } from '../view/GuidedTourPopup';

class TourHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            step: 0,
            steps: [],
            position: null,
            loading: false
        });
        this.popupControls = null;
        this.initSteps();
    };

    getName () {
        return 'GuidedTourHandler';
    }

    initSteps () {
        const delegate = {
            bundleName: this.instance.getName(),
            priority: 0,
            getTitle: () => {
                return Oskari.getMsg('GuidedTour', 'page1.title');
            },
            getContent: () => {
                return Oskari.getMsg('GuidedTour', 'page1.message');
            }
        };
        this.addStep(delegate);
    }

    addStep (stepDelegate) {
        let delegate = stepDelegate;

        if (this.instance.conf && this.instance.conf.steps) {
            delegate = this.handleDelegateConf(delegate, this.instance.conf.steps);
        }

        if (typeof delegate.priority === 'number') {
            const priorities = this.state.steps.map((d) => d.priority);
            const insertLocation = this.getPriorityIndex(priorities, delegate.priority);
            this.state.steps.splice(insertLocation, 0, delegate);
            if (this.state.step >= insertLocation && this.state.steps.length !== 1) { // correct current location
                this.updateState({ step: this.state.step++ });
            }
        } else {
            delegate.priority = this.state.steps[this.state.steps.length - 1].priority + 1;
            this.updateState({
                steps: [...this.state.steps, delegate]
            });
        }

        this._showGuideContentForStep(this.state.step);
    }

    getPriorityIndex (priorities, newPriority) {
        let index = 0;
        if (priorities.length === 0) return 0;
        const length = priorities.length === 1 ? 1 : priorities.length - 1;
        while (index <= length) {
            if (newPriority <= priorities[index]) {
                return index;
            }
            index++;
        }
        return index;
    }

    handleDelegateConf (delegate, steps) {
        // step ordering
        const index = steps.map((s) => s.bundleName).indexOf(delegate.bundleName);
        if (delegate.bundleName !== this.instance.getName()) {
            if (index < 0) {
                return;
            }
            delegate.priority = index + 1;
        }

        // custom content
        if (index >= 0) {
            const content = steps[index].content;
            if (content) {
                delegate.getContent = () => { // empty placeholder while loading
                    return '';
                };
                this.getGuideContent(content, (success, response) => {
                    if (success) {
                        delegate.getContent = () => { return response.body; };
                        delegate.getTitle = () => { return response.title; };
                    } else {
                        Oskari.log(this.instance.getName()).error('Failed to load guided tour content for step "' + steps[index].bundleName + '" with tags: ' + content);
                    }
                });
            }
        }
        return delegate;
    }

    _showGuideContentForStep (stepIndex) {
        if (stepIndex !== this.state.step) {
            this.updateState({
                step: stepIndex
            });
        }
        const step = this.state.steps[stepIndex];
        const content = step.getContent();
        const title = step.getTitle();
        let links = [];
        if (typeof step.getLinks === 'function' && step.getLinks() !== null) {
            links = step.getLinks();
        }
        if (typeof step.show === 'function') {
            step.show();
        }
        this.openPopup(title, content, links);
    }

    getGuideContent (tags, callback) {
        jQuery.ajax({
            url: Oskari.urls.getRoute('GetArticlesByTag'),
            data: {
                tags: tags
            },
            type: 'GET',
            dataType: 'json',
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType('application/j-son;charset=UTF-8');
                }
            },
            success: function (resp) {
                /* eslint-disable n/no-callback-literal */
                if (resp && resp.articles[0] && resp.articles[0].content) {
                    callback(true, resp.articles[0].content);
                } else {
                    callback(false);
                }
            },
            error: function () {
                callback(false);
            }
        });
    }

    popupCleanup (dontShowAgain = false) {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = null;

        if (dontShowAgain) {
            jQuery.cookie(
                'pti_tour_seen', '1', {
                    expires: 365
                }
            );
        }
        this.hide();
    }

    hide () {
        const step = this.state.steps[this.state.step];
        if (typeof step.hide === 'function') {
            step.hide();
        }
    }

    next () {
        this.hide();
        this._showGuideContentForStep(++this.state.step);
    }

    previous () {
        this.hide();
        this._showGuideContentForStep(--this.state.step);
    }

    openPopup (title, content, links) {
        if (this.popupControls) {
            this.popupControls.update(
                title,
                content,
                links,
                this.state,
                this.getController(),
                (dontShowAgain) => this.popupCleanup(dontShowAgain)
            );
        } else {
            this.popupControls = showGuidedTourPopup(
                title,
                content,
                links,
                this.state,
                this.getController(),
                (dontShowAgain) => this.popupCleanup(dontShowAgain)
            );
        }
    }
}

const wrapped = controllerMixin(TourHandler, [
    'next',
    'previous'
]);

export { wrapped as GuidedTourHandler };
