
export default class PromiseLimiter {
    constructor(options) {
        let defaults = {
            minElapsedTime: 100,
        };
        this._options = Object.assign({}, defaults, options);
        this._lastPopTime = 0;
        this._queue = [];
    }

    get minElapsedTime() {
        return this._options.minElapsedTime;
    }

    set minElapsedTime(milliseconds) {
        this._options.minElapsedTime = milliseconds
    }

    add(fn, thisArg = null, argsArray = null) {
        return new Promise((resolve, reject) => {
            this._queue.push({resolve, reject, fn, thisArg, argsArray});
            this._tryApply();
        });
    }

    _tryApply() {
        let timingInfo = this._timingInfo();
        if (timingInfo.canApplyNow) {
            this._lastPopTime = timingInfo.now;
            this._applyNext();
        } else {
            this._tryApplyLater(timingInfo.delayRequired);
        }
    }

    _tryApplyLater(delay) {
        setTimeout(() => {
            this._tryApply();
        }, delay);
    }

    _applyNext() {
        let obj = this._queue.shift();
        obj.fn.apply(obj.thisArg, obj.argsArray).then(obj.resolve, obj.reject);
    }

    _timingInfo() {
        let now = Date.now();
        let elapsedTime = now - this._lastPopTime;
        let delayRequired = this._options.minElapsedTime - elapsedTime;
        let canApplyNow = elapsedTime >= this._options.minElapsedTime;
        return {now, elapsedTime, delayRequired, canApplyNow};
    }
}
