import { LOADING_STATUS_VALUE } from './AbstractLayerHandler.ol';

export class RequestCounter {
    constructor () {
        this._init();
    }

    _init () {
        this.started = 0;
        this.errors = 0;
        this.completed = 0;
        this.lastStatusUpdate = null;
    }

    isFirstPending () {
        return this.started === 1 && this.completed + this.errors === 0;
    }

    hasAllFailed () {
        return this.errors >= this.started;
    }

    isFinished () {
        return this.completed + this.errors >= this.started;
    }

    isPending () {
        return this.started > this.completed + this.errors;
    }

    /**
     * @method getFinishedStatus
     * @return Loading status if all pending requests have been received, else null.
     */
    getFinishedStatus () {
        if (this.isPending()) {
            return null;
        }
        if (this.hasAllFailed()) {
            return LOADING_STATUS_VALUE.ERROR;
        }
        return LOADING_STATUS_VALUE.COMPLETE;
    }

    getLastStatusUpdate () {
        return this.lastStatusUpdate;
    }

    update (status) {
        switch (status) {
        case LOADING_STATUS_VALUE.LOADING: this.started++; break;
        case LOADING_STATUS_VALUE.COMPLETE: this.completed++; break;
        case LOADING_STATUS_VALUE.ERROR: this.errors++; break;
        }
        this.lastStatusUpdate = status;
    }

    reset () {
        this._init();
    }
}
