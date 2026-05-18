var glob = require('glob');
var fs = require('fs');
var out = '';
var files = glob.sync('src/**/*.@(cpp|h)');
var re = /\/\*\^jsdoc\s*\n((.|\n|\r)*?)\^jsdoc\*\//g;
files.forEach(function(path) {
    var text = fs.readFileSync(path, 'utf8');
    var m;
    while ((m = re.exec(text)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        out += '/**\n' + m[1] + '\n*/\n\n';
    }
});
fs.writeFileSync('tmp.js', out);