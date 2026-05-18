'use strict';

var fs = require('fs'), path = require('path'), File = require('vinyl'),
    vfs = require('vinyl-fs'), _ = require('lodash'),
    concat = require('concat-stream'),
    GithubSlugger = require('github-slugger'),
    createFormatters = require('documentation').util.createFormatters,
    LinkerStack = require('documentation').util.LinkerStack,
    hljs = require('highlight.js');

function isFunction(section) {
    return section.kind === 'function' ||
        section.kind === 'typedef' && section.type.type === 'NameExpression' &&
        section.type.name === 'Function';
}

module.exports = function(comments, config) {
    var linkerStack = new LinkerStack(config).namespaceResolver(
        comments, function(namespace) {
            var slugger = new GithubSlugger();
            return '#' + slugger.slug(namespace);
        });

    var formatters = createFormatters(linkerStack.link);

    hljs.configure(config.hljs || {});

    var sharedImports = {
        imports: {
            slug(str) {
                var slugger = new GithubSlugger();
                return slugger.slug(str);
            },
            formatParams(section) {
                if (section.kind !== 'class' && !isFunction(section)) return '';
                return formatters.parameters(section, true);
            },
            shortSignature(section) {
                var prefix = '';
                if (section.kind === 'class') {
                    prefix = 'new ';
                } else if (!isFunction(section)) {
                    return section.name;
                }
                return prefix + section.name +
                    formatters.parameters(section, true);
            },
            signature(section) {
                var returns = '';
                var prefix = '';
                if (section.kind === 'class') {
                    prefix = 'new ';
                } else if (!isFunction(section)) {
                    return section.name;
                }
                if (section.returns.length) {
                    returns = ': ' + formatters.type(section.returns[0].type);
                }
                return prefix + section.name + formatters.parameters(section) +
                    returns;
            },
            md(ast, inline) {
                if (inline && ast && ast.children.length &&
                    ast.children[0].type === 'paragraph') {
                    ast = {
                        type: 'root',
                        children: ast.children[0].children.concat(
                            ast.children.slice(1))
                    };
                }
                return formatters.markdown(ast);
            },
            formatType: formatters.type,
            autolink: formatters.autolink,
            highlight(example) {
                if (config.hljs && config.hljs.highlightAuto) {
                    return hljs.highlightAuto(example).value;
                }
                return hljs.highlight('js', example).value;
            },
            fullPath(comment) {
                return comment.path.reduce(function(acc, current, idx) {
                    return acc + ((idx > 0) ? '.' : '') + current.name;
                }, '');
            }
        }
    };

    sharedImports.imports.renderSectionList = _.template(
        fs.readFileSync(path.join(__dirname, 'section_list._'), 'utf8'),
        sharedImports);
    sharedImports.imports.renderSection = _.template(
        fs.readFileSync(path.join(__dirname, 'section._'), 'utf8'),
        sharedImports);
    sharedImports.imports.renderNote = _.template(
        fs.readFileSync(path.join(__dirname, 'note._'), 'utf8'), sharedImports);
    sharedImports.imports.renderParamProperty = _.template(
        fs.readFileSync(path.join(__dirname, 'paramProperty._'), 'utf8'),
        sharedImports);
    sharedImports.imports.renderParamPropertyTable = _.template(
        fs.readFileSync(path.join(__dirname, 'paramPropertyTable._'), 'utf8'),
        sharedImports);

    var pageTemplate = _.template(
        fs.readFileSync(path.join(__dirname, 'index._'), 'utf8'),
        sharedImports);

    var topLevelReducer = function(acc, current) {
        var tagIsToplevel = function(e) {
            return e.title == 'toplevel';
        };
        var tagIsHidesecondlevel = function(e) {
            return e.title == 'hidesecondlevel';
        };

        if (current.kind == 'note') {
            acc.push(current);
            return acc;
        }
        if (current.tags.some(tagIsToplevel)) {
            // apparently this is how everyone does deep copies so it'll do
            // ¯\_(ツ)_/¯
            var currentWithoutToplevel = JSON.parse(JSON.stringify(current));
            for (var _memberType in currentWithoutToplevel.members) {
                var memberType = currentWithoutToplevel.members[_memberType];
                var cleanMemberType = [];
                for (var _member in memberType) {
                    var member = memberType[_member];
                    if (!member.tags.some(tagIsToplevel) &&
                        !member.tags.some(tagIsHidesecondlevel)) {
                        cleanMemberType.push(member);
                    }
                }
                currentWithoutToplevel.members[_memberType] = cleanMemberType;
            }
            acc.push(currentWithoutToplevel);
        }
        for (var memberType in current.members) {
            acc = acc.concat(
                current.members[memberType].reduce(topLevelReducer, []));
        }
        return acc;
    };
    var topLevel = comments.reduce(topLevelReducer, []);

    // push assets into the pipeline as well.
    return new Promise(function(resolve) {
        vfs.src([__dirname + '/assets/**'], {base: __dirname})
            .pipe(concat(function(files) {
                resolve(files.concat(new File({
                    path: 'index.html',
                    contents: new Buffer(
                        pageTemplate({docs: topLevel, config}), 'utf8')
                })));
            }));
    });
};