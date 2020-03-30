/**
 * Provides logger functionality for Oskari
 * var log = Oskari.log('MyLog');
 * log.enableDebug(true);
 * log.debug('my debug message');
 * log.warn('my warn message');
 * log.error('my error message');
 */
function getConsole() {
    return console;
}

const hasConsole = !!getConsole();
// Set to true to enable timestamps in log messages
let _inclTimestamp = false;

const messageBuffer = [];
function flushMessages() {
    while(messageBuffer.length) {
        _logMsg(messageBuffer.shift());
    }
}
const throttledFlush = throttle(flushMessages, 20000);

// from oskari.util
function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
//setInterval(throttledFlush, 2000);

/** Utility methods for logger */
function _logMsg(args) {
    var level = args.shift();
    const logOutput = getConsole();
    if (!hasConsole ||
        !logOutput[level] ||
        !logOutput[level].apply) {
        // maybe gather messages and provide a custom debug console?
        return;
    }
    logOutput[level].apply(getConsole(), args);
}

function ts() {
    if (!_inclTimestamp) {
        return '';
    }
    var date = new Date();
    return date.toLocaleTimeString() + '.' + date.getUTCMilliseconds() + ' ';
}

function _doLogging(logName, logLevel, logMessages) {
    var header = ts() + logName + ':';
    // prefix messages with logName
    logMessages.unshift(header);
    // prefix logName + messages with logLevel
    logMessages.unshift(logLevel);
    // write to log
    messageBuffer.push(logMessages);
    throttledFlush();
    //_logMsg(logMessages);
}

// this will be shared between all loggers
let _globalDebug = false;
// these will be private and switched/logger
let _isDebug = new WeakMap();
let _deprecatedMessages = new WeakMap();

export default class Logger {
    constructor(name) {
        this.name = name || 'Logger';
    }
    enableDebug(enable) {
        _isDebug.set(this, !!enable);
    }
    enableGlobalDebug(enable) {
        _globalDebug = !!enable;
    }
    enableTimestamps(enable) {
        _inclTimestamp = !!enable;
    }
    isDebug () {
        return _globalDebug || _isDebug.get(this);
    }
    debug (...args) {
        if (!this.isDebug()) {
            return;
        }
        _doLogging(this.name, 'debug', args);
    }
    info (...args) {
        _doLogging(this.name, 'log', args);
    }
    warn (...args) {
        _doLogging(this.name, 'warn', args);
    }
    error (...args) {
        _doLogging(this.name, 'error', args);
    }
    deprecated (name, extraInfo) {
        let deprecatedMessagesSent = _deprecatedMessages.get(this) || {};
        if (!deprecatedMessagesSent[name]) {
            deprecatedMessagesSent[name] = 0;
            _deprecatedMessages.set(this, deprecatedMessagesSent);
        }
        deprecatedMessagesSent[name]++;
        if (deprecatedMessagesSent[name] > 1) {
            // Fall silent after 1 warnings/deprecation
            return;
        }
        _doLogging(this.name, 'warn',
            [name + ' will be removed in future release.', extraInfo || 'Remove calls to it.']);
    }
}