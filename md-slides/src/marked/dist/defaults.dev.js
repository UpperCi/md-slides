"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaults = getDefaults;
exports.changeDefaults = changeDefaults;
exports.defaults = void 0;

function getDefaults() {
  return {
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}

var defaults = getDefaults();
exports.defaults = defaults;

function changeDefaults(newDefaults) {
  exports.defaults = defaults = newDefaults;
}