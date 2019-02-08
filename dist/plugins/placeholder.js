"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultOptions = {
    emptyInputCssClass: 'empty-input',
    emptyInputText: '',
    align: 'left'
  };
  options = _objectSpread({}, defaultOptions, options);
  return new _prosemirrorState.Plugin({
    props: {
      decorations: function decorations(_ref) {
        var doc = _ref.doc;
        var decorations = [];

        if (doc.textContent === '' && doc.childCount <= 1 && doc.content.size <= 2) {
          doc.descendants(function (node, pos) {
            var decoration = _prosemirrorView.Decoration.node(pos, pos + node.nodeSize, {
              class: options.emptyInputCssClass,
              'data-empty-input-text': options.emptyInputText,
              'data-empty-input-align': options.align
            });

            decorations.push(decoration);
          });
        }

        return _prosemirrorView.DecorationSet.create(doc, decorations);
      }
    }
  });
};

exports.default = _default;
//# sourceMappingURL=placeholder.js.map
