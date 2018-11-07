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

/** Utility methods for logger */
function _logMsg(args) {
    var level = args.shift();
    if (!hasConsole ||
        !getConsole()[level] ||
        !getConsole()[level].apply) {
        // maybe gather messages and provide a custom debug console?
        return;
    }
    getConsole()[level].apply(getConsole(), args);
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
    _logMsg(logMessages);
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