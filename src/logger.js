/**
 * Provides logger functionality for Oskari
 * var log = Oskari.log('MyLog');
 * log.enableDebug(true);
 * log.debug('my debug message');
 * log.warn('my warn message');
 * log.error('my error message');
 */
(function () {
    var hasConsole = window.console;
    // Set to true to enable timestamps in log messages
    var inclTimestamp = false;
    /** Utility methods for logger */
    var _logMsg = function (args) {
        var level = args.shift();
        if (!hasConsole ||
            !window.console[level] ||
            !window.console[level].apply) {
            // maybe gather messages and provide a custom debug console?
            return;
        }
        window.console[level].apply(window.console, args);
    };

    var _unshift = function (addToFirst, list) {
        var args = Array.prototype.slice.call(list);
        args.unshift(addToFirst);
        return args;
    };
    var ts = function () {
        if (!inclTimestamp) {
            return '';
        }
        var date = new Date();
        return date.toLocaleTimeString() + '.' + date.getUTCMilliseconds() + ' ';
    };
    var _doLogging = function (logName, logLevel, logMessages, includeCaller, callee) {
        var header = ts() + logName + ':';
        // prefix messages with logName
        var newArgs = _unshift(header, logMessages);
        // prefix logName + messages with logLevel
        newArgs = _unshift(logLevel, newArgs);
        // attach caller info if available and requested
        if (includeCaller && callee && callee.caller) {
            newArgs.push(callee.caller);
        }
        // write to log
        _logMsg(newArgs, callee);
    };
    /**
     * Logger definition
     * @param {String} name logger name
     */
    var Logger = function (name, enableDebug, inclCaller) {
        this.name = name || 'Logger';
        this.isDebug = !!enableDebug;
        this.includeCaller = !!inclCaller;
    };

    Logger.prototype.setInclCaller = function (bln) {
        this.includeCaller = !!bln;
    };

    Logger.prototype.enableDebug = function (bln) {
        this.isDebug = !!bln;
    };

    Logger.prototype.debug = function () {
        if (!this.isDebug) {
            return;
        }
        _doLogging(this.name, 'debug', arguments, this.includeCaller, arguments.callee);
    };

    Logger.prototype.info = function () {
        _doLogging(this.name, 'log', arguments, this.includeCaller, arguments.callee);
    };

    Logger.prototype.warn = function () {
        _doLogging(this.name, 'warn', arguments, this.includeCaller, arguments.callee);
    };

    // Warn 2 times before falling silent
    var deprecatedMessagesSent = {};
    Logger.prototype.deprecated = function (name, extraInfo) {
        if (!deprecatedMessagesSent[name]) {
            deprecatedMessagesSent[name] = 0;
        }
        deprecatedMessagesSent[name]++;
        if (deprecatedMessagesSent[name] < 3) {
            _doLogging(this.name, 'warn',
                [name + ' will be removed in future release.', extraInfo || 'Remove calls to it.'],
                this.includeCaller, arguments.callee);
        }
    };

    Logger.prototype.error = function () {
        _doLogging(this.name, 'error', arguments, this.includeCaller, arguments.callee);
    };

    // keep track of existing loggers
    var loggers = {};

    Oskari.log = function (logName) {
        logName = logName || 'Oskari';
        if (loggers[logName]) {
            return loggers[logName];
        }
        var log = new Logger(logName);
        loggers[logName] = log;
        return log;
    };
}());
