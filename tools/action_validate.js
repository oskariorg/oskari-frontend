module.exports = new ValidateAction();
function ValidateAction() {
    var fs = require('fs');
    var parser = require('./parser');
    var validator = require('./validator');

    this.handle = function(processedAppSetup) {
        var files = [];
        var validationDir = './validation/';
        if (!fs.existsSync(validationDir)) {
            fs.mkdirSync(validationDir);
        }
        for (var j = 0; j < processedAppSetup.length; ++j) {
            var array = parser.getFilesForComponent(processedAppSetup[j], 'javascript');
            for (var i = 0; i < array.length; ++i) {
                validator.validateJS(array[i], processedAppSetup[j].name);
            }
            validator.writeLog(validationDir + processedAppSetup[j].name + '.txt');
        }
    }
}