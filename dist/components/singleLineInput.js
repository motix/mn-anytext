"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleLineInput = exports.SingleLineInputView = exports.SingleLineInputState = exports.SingleLineInputSchema = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _placeholder = _interopRequireDefault(require("../plugins/placeholder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SingleLineInputSchema =
/*#__PURE__*/
function (_Schema) {
  _inherits(SingleLineInputSchema, _Schema);

  function SingleLineInputSchema(spec) {
    _classCallCheck(this, SingleLineInputSchema);

    var defaultSpec = {
      nodes: {
        doc: {
          content: 'div'
        },
        div: {
          content: 'text*',
          parseDOM: [{
            tag: 'div'
          }],
          toDOM: function toDOM() {
            return ['div', 0];
          }
        },
        text: {}
      }
    };
    spec = _objectSpread({}, defaultSpec, spec);
    return _possibleConstructorReturn(this, _getPrototypeOf(SingleLineInputSchema).call(this, spec));
  }

  return SingleLineInputSchema;
}(_prosemirrorModel.Schema);

exports.SingleLineInputSchema = SingleLineInputSchema;

var SingleLineInputState =
/*#__PURE__*/
function (_EditorState) {
  _inherits(SingleLineInputState, _EditorState);

  function SingleLineInputState() {
    _classCallCheck(this, SingleLineInputState);

    return _possibleConstructorReturn(this, _getPrototypeOf(SingleLineInputState).apply(this, arguments));
  }

  _createClass(SingleLineInputState, null, [{
    key: "create",
    value: function create(config) {
      config.schema = config.schema || (config.doc ? config.doc.schema : new SingleLineInputSchema());
      config.doc = config.doc || config.schema.node('doc', null, [config.schema.node('div', null, config.value ? [config.schema.text(config.value)] : [])]);
      return _get(_getPrototypeOf(SingleLineInputState), "create", this).call(this, config);
    }
  }]);

  return SingleLineInputState;
}(_prosemirrorState.EditorState);

exports.SingleLineInputState = SingleLineInputState;

var SingleLineInputView =
/*#__PURE__*/
function (_EditorView) {
  _inherits(SingleLineInputView, _EditorView);

  function SingleLineInputView(place, props) {
    _classCallCheck(this, SingleLineInputView);

    if (!props.state) {
      var plugins = [(0, _placeholder.default)(props.placeholder || {})];

      var decorations = function decorations(_ref) {
        var doc = _ref.doc;
        var decorations = [];

        if (props.prefix) {
          var decoration = _prosemirrorView.Decoration.node(0, doc.firstChild.nodeSize, {
            'data-prefix-text': props.prefix
          });

          decorations.push(decoration);
        }

        if (props.suffix) {
          var _decoration = _prosemirrorView.Decoration.node(0, doc.firstChild.nodeSize, {
            'data-suffix-text': props.suffix
          });

          decorations.push(_decoration);
        }

        return _prosemirrorView.DecorationSet.create(doc, decorations);
      };

      props.state = SingleLineInputState.create({
        value: props.value,
        plugins: plugins
      });
      props.decorations = decorations;
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(SingleLineInputView).call(this, place, props));
  }

  _createClass(SingleLineInputView, [{
    key: "updateValue",
    value: function updateValue(value) {
      var tr = this.state.tr;
      tr.doc.descendants(function (node, pos) {
        if (node.isTextblock) {
          tr.insertText(value, pos + 1, pos + 1 + node.content.size);
        }
      });
      this.dispatch(tr);
    }
  }, {
    key: "dispatch",
    value: function dispatch(tr) {
      _get(_getPrototypeOf(SingleLineInputView.prototype), "dispatch", this).call(this, tr);

      if (tr.docChanged && this.props.onChange) {
        this.props.onChange.bind(this)(this, tr);
      }
    }
  }]);

  return SingleLineInputView;
}(_prosemirrorView.EditorView);

exports.SingleLineInputView = SingleLineInputView;

var SingleLineInput =
/*#__PURE__*/
function () {
  function SingleLineInput(place, props) {
    _classCallCheck(this, SingleLineInput);

    props.value = typeof props.value === 'undefined' || props.value === null ? '' : String(props.value);
    props.wrapping = typeof props.wrapping === 'undefined' || props.wrapping === null ? true : props.wrapping;

    if (props.placeholder) {
      for (var i in props.placeholder) {
        if (typeof props.placeholder[i] === 'undefined' || props.placeholder[i] === null) {
          delete props.placeholder[i];
        }
      }
    }

    this.view = new SingleLineInputView(place, props);
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if (props.wrapping) {
      this.view.dom.style.whiteSpace = isFirefox ? 'pre-wrap' : null;
    } else {
      this.view.dom.style.whiteSpace = isFirefox ? 'pre' : 'nowrap';
    }
  }

  _createClass(SingleLineInput, [{
    key: "value",
    get: function get() {
      return this.view.state.doc.textContent;
    },
    set: function set(value) {
      value = typeof value === 'undefined' || value === null ? '' : String(value);

      if (value !== this.value) {
        this.view.updateValue(value);
      }
    }
  }]);

  return SingleLineInput;
}();

exports.SingleLineInput = SingleLineInput;
//# sourceMappingURL=singleLineInput.js.map
