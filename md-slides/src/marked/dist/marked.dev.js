"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.marked = marked;
Object.defineProperty(exports, "Lexer", {
  enumerable: true,
  get: function get() {
    return _Lexer.Lexer;
  }
});
Object.defineProperty(exports, "Parser", {
  enumerable: true,
  get: function get() {
    return _Parser.Parser;
  }
});
Object.defineProperty(exports, "Tokenizer", {
  enumerable: true,
  get: function get() {
    return _Tokenizer.Tokenizer;
  }
});
Object.defineProperty(exports, "Renderer", {
  enumerable: true,
  get: function get() {
    return _Renderer.Renderer;
  }
});
Object.defineProperty(exports, "TextRenderer", {
  enumerable: true,
  get: function get() {
    return _TextRenderer.TextRenderer;
  }
});
Object.defineProperty(exports, "Slugger", {
  enumerable: true,
  get: function get() {
    return _Slugger.Slugger;
  }
});
Object.defineProperty(exports, "defaults", {
  enumerable: true,
  get: function get() {
    return _defaults.defaults;
  }
});
Object.defineProperty(exports, "getDefaults", {
  enumerable: true,
  get: function get() {
    return _defaults.getDefaults;
  }
});
exports.lexer = exports.parser = exports.parse = exports.parseInline = exports.walkTokens = exports.use = exports.setOptions = exports.options = void 0;

var _Lexer = require("./Lexer.js");

var _Parser = require("./Parser.js");

var _Tokenizer = require("./Tokenizer.js");

var _Renderer = require("./Renderer.js");

var _TextRenderer = require("./TextRenderer.js");

var _Slugger = require("./Slugger.js");

var _helpers = require("./helpers.js");

var _defaults = require("./defaults.js");

/**
 * Marked
 */
function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }

  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
  }

  if (typeof opt === 'function') {
    callback = opt;
    opt = null;
  }

  opt = (0, _helpers.merge)({}, marked.defaults, opt || {});
  (0, _helpers.checkSanitizeDeprecation)(opt);

  if (callback) {
    var highlight = opt.highlight;
    var tokens;

    try {
      tokens = _Lexer.Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    var done = function done(err) {
      var out;

      if (!err) {
        try {
          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }

          out = _Parser.Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }
      }

      opt.highlight = highlight;
      return err ? callback(err) : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;
    if (!tokens.length) return done();
    var pending = 0;
    marked.walkTokens(tokens, function (token) {
      if (token.type === 'code') {
        pending++;
        setTimeout(function () {
          highlight(token.text, token.lang, function (err, code) {
            if (err) {
              return done(err);
            }

            if (code != null && code !== token.text) {
              token.text = code;
              token.escaped = true;
            }

            pending--;

            if (pending === 0) {
              done();
            }
          });
        }, 0);
      }
    });

    if (pending === 0) {
      done();
    }

    return;
  }

  try {
    var _tokens = _Lexer.Lexer.lex(src, opt);

    if (opt.walkTokens) {
      marked.walkTokens(_tokens, opt.walkTokens);
    }

    return _Parser.Parser.parse(_tokens, opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';

    if (opt.silent) {
      return '<p>An error occurred:</p><pre>' + (0, _helpers.escape)(e.message + '', true) + '</pre>';
    }

    throw e;
  }
}
/**
 * Options
 */


marked.options = marked.setOptions = function (opt) {
  (0, _helpers.merge)(marked.defaults, opt);
  (0, _defaults.changeDefaults)(marked.defaults);
  return marked;
};

marked.getDefaults = _defaults.getDefaults;
marked.defaults = _defaults.defaults;
/**
 * Use Extension
 */

marked.use = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var opts = _helpers.merge.apply(void 0, [{}].concat(args));

  var extensions = marked.defaults.extensions || {
    renderers: {},
    childTokens: {}
  };
  var hasExtensions;
  args.forEach(function (pack) {
    // ==-- Parse "addon" extensions --== //
    if (pack.extensions) {
      hasExtensions = true;
      pack.extensions.forEach(function (ext) {
        if (!ext.name) {
          throw new Error('extension name required');
        }

        if (ext.renderer) {
          // Renderer extensions
          var prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;

          if (prevRenderer) {
            // Replace extension with func to run new extension but fall back if false
            extensions.renderers[ext.name] = function () {
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              var ret = ext.renderer.apply(this, args);

              if (ret === false) {
                ret = prevRenderer.apply(this, args);
              }

              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }

        if (ext.tokenizer) {
          // Tokenizer Extensions
          if (!ext.level || ext.level !== 'block' && ext.level !== 'inline') {
            throw new Error("extension level must be 'block' or 'inline'");
          }

          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }

          if (ext.start) {
            // Function to check for start of token
            if (ext.level === 'block') {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === 'inline') {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }

        if (ext.childTokens) {
          // Child tokens to be visited by walkTokens
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
    } // ==-- Parse "overwrite" extensions --== //


    if (pack.renderer) {
      (function () {
        var renderer = marked.defaults.renderer || new _Renderer.Renderer();

        var _loop = function _loop(prop) {
          var prevRenderer = renderer[prop]; // Replace renderer with func to run extension, but fall back if false

          renderer[prop] = function () {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            var ret = pack.renderer[prop].apply(renderer, args);

            if (ret === false) {
              ret = prevRenderer.apply(renderer, args);
            }

            return ret;
          };
        };

        for (var prop in pack.renderer) {
          _loop(prop);
        }

        opts.renderer = renderer;
      })();
    }

    if (pack.tokenizer) {
      (function () {
        var tokenizer = marked.defaults.tokenizer || new _Tokenizer.Tokenizer();

        var _loop2 = function _loop2(prop) {
          var prevTokenizer = tokenizer[prop]; // Replace tokenizer with func to run extension, but fall back if false

          tokenizer[prop] = function () {
            for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              args[_key4] = arguments[_key4];
            }

            var ret = pack.tokenizer[prop].apply(tokenizer, args);

            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args);
            }

            return ret;
          };
        };

        for (var prop in pack.tokenizer) {
          _loop2(prop);
        }

        opts.tokenizer = tokenizer;
      })();
    } // ==-- Parse WalkTokens extensions --== //


    if (pack.walkTokens) {
      var _walkTokens = marked.defaults.walkTokens;

      opts.walkTokens = function (token) {
        pack.walkTokens.call(this, token);

        if (_walkTokens) {
          _walkTokens.call(this, token);
        }
      };
    }

    if (hasExtensions) {
      opts.extensions = extensions;
    }

    marked.setOptions(opts);
  });
};
/**
 * Run callback for every token
 */


marked.walkTokens = function (tokens, callback) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop3 = function _loop3() {
      var token = _step.value;
      callback.call(marked, token);

      switch (token.type) {
        case 'table':
          {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = token.header[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var cell = _step2.value;
                marked.walkTokens(cell.tokens, callback);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = token.rows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var row = _step3.value;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                  for (var _iterator4 = row[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _cell = _step4.value;
                    marked.walkTokens(_cell.tokens, callback);
                  }
                } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                      _iterator4["return"]();
                    }
                  } finally {
                    if (_didIteratorError4) {
                      throw _iteratorError4;
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            break;
          }

        case 'list':
          {
            marked.walkTokens(token.items, callback);
            break;
          }

        default:
          {
            if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
              // Walk any extensions
              marked.defaults.extensions.childTokens[token.type].forEach(function (childTokens) {
                marked.walkTokens(token[childTokens], callback);
              });
            } else if (token.tokens) {
              marked.walkTokens(token.tokens, callback);
            }
          }
      }
    };

    for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop3();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};
/**
 * Parse Inline
 */


marked.parseInline = function (src, opt) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked.parseInline(): input parameter is undefined or null');
  }

  if (typeof src !== 'string') {
    throw new Error('marked.parseInline(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
  }

  opt = (0, _helpers.merge)({}, marked.defaults, opt || {});
  (0, _helpers.checkSanitizeDeprecation)(opt);

  try {
    var tokens = _Lexer.Lexer.lexInline(src, opt);

    if (opt.walkTokens) {
      marked.walkTokens(tokens, opt.walkTokens);
    }

    return _Parser.Parser.parseInline(tokens, opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';

    if (opt.silent) {
      return '<p>An error occurred:</p><pre>' + (0, _helpers.escape)(e.message + '', true) + '</pre>';
    }

    throw e;
  }
};
/**
 * Expose
 */


marked.Parser = _Parser.Parser;
marked.parser = _Parser.Parser.parse;
marked.Renderer = _Renderer.Renderer;
marked.TextRenderer = _TextRenderer.TextRenderer;
marked.Lexer = _Lexer.Lexer;
marked.lexer = _Lexer.Lexer.lex;
marked.Tokenizer = _Tokenizer.Tokenizer;
marked.Slugger = _Slugger.Slugger;
marked.parse = marked;
var options = marked.options;
exports.options = options;
var setOptions = marked.setOptions;
exports.setOptions = setOptions;
var use = marked.use;
exports.use = use;
var walkTokens = marked.walkTokens;
exports.walkTokens = walkTokens;
var parseInline = marked.parseInline;
exports.parseInline = parseInline;
var parse = marked;
exports.parse = parse;
var parser = _Parser.Parser.parse;
exports.parser = parser;
var lexer = _Lexer.Lexer.lex;
exports.lexer = lexer;