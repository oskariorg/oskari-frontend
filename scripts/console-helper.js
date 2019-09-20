const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[1;33m',
    orange: '\x1b[0;33m',
    blue: '\x1b[1;34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[1;36m',
    white: '\x1b[0;37m',
    gray: '\x1b[1;37m'
};

const baseColor = colors.cyan;
const highlightColor = colors.yellow;
const errorColor = colors.red;

const base = str => `${baseColor}${str}${colors.reset}`;
const highlight = str => `${highlightColor}${str}${baseColor}`;
const error = str => `${errorColor}${str}${baseColor}`;
const log = str => console.log(base(str));

const messages = {
    devModeEnabled: log.bind(null, `Oskari development mode is ${highlight('enabled')}.\nUser is in full control over oskari-frontend dependency.\n`),
    devModeDisabled: log.bind(null, `Oskari development mode is ${highlight('disabled')}.\nUsing GitHub repository as oskari-frontend dependency.\n`),
    expectEnabled: log.bind(null, `Expecting Oskari development mode to be enabled.`),
    expectDisabled: log.bind(null, `Expecting Oskari development mode to be disabled.`),
    runInNormalMode: log.bind(null,
        'Cannot run the command when Oskari development mode is disabled. ' +
        error('Try running npm commands (build & start) without ') + highlight(':dev') + error('-option.\n') +
        `To enable development mode, run ${highlight('dev-mode:enable')}.`),
    runInDevMode: log.bind(null,
        'Cannot run the command when Oskari development mode is enabled. ' +
        error('Try running npm commands (build & start) with ') + highlight(':dev') + error('-option.\n') +
        `To disable development mode, run ${highlight('dev-mode:disable')}.`),
    installFailed: log.bind(null, error('Install failed!')),
    oskariModuleNotFound: log.bind(null, `Oskari dependency was not found.\nRun ${highlight('npm install')}.`),
    oskariPeerNotFound: log.bind(null, `Oskari dependency was not found.\nRun ${highlight('npm install')}.`),
    devModeCheckInvalidArgs: log.bind(null, `Oskari development mode check expects an argument. ${highlight('(enabled|disabled|check)')}`)
};

const exit = code => {
    if (code) {
        log(`\nExiting with error: ${code}\n`);
    }
    process.exit(code);
};

module.exports = {
    ...messages,
    log,
    exit
};
