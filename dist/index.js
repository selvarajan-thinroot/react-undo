'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *
 * UndoRedo
 *
 * A simple React Component that encapsulates any other component to provide undo/redo functionality for it.
 *
 * It works by sitting between the component that should have tracked props and the parent that provides them. The
 * child component is then responsible for triggering undo/redo actions.
 *
 */

var UndoRedo = function (_React$PureComponent) {
  _inherits(UndoRedo, _React$PureComponent);

  // eslint-disable-line react/prefer-stateless-function
  function UndoRedo(props) {
    _classCallCheck(this, UndoRedo);

    var _this = _possibleConstructorReturn(this, (UndoRedo.__proto__ || Object.getPrototypeOf(UndoRedo)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      history: [_this.getTrackedProps(props)],
      current: 0
    };
    return _this;
  }

  _createClass(UndoRedo, [{
    key: 'render',
    value: function render() {
      var undoRedo = {
        canUndo: this.canUndo,
        canRedo: this.canRedo,
        undo: this.undo,
        redo: this.redo,
        addStep: this.addStep
      };
      var ElementType = this.props.as;
      return _react2.default.createElement(ElementType, _extends({
        undoRedo: undoRedo
      }, this.props.props));
    }
  }]);

  return UndoRedo;
}(_react2.default.PureComponent);

// PropTypes


var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.addNewHistoryElement = function (element) {
    // determine whether we need to remove elements from the history
    var current = _this2.state.current;
    var history = _this2.state.history;
    if (current < history.length - 1) {
      history.length = current + 1; // faster than splice
    }
    history.push(element);
    _this2.setState({
      history: history,
      current: history.length - 1
    });
  };

  this.getTrackedProps = function (props) {
    var trackedProps = {};
    if (props.trackProps.length < 1) {
      return trackedProps;
    }
    props.trackProps.forEach(function (propName) {
      var val = props.props[propName];
      if (trackedProps[propName] !== val) {
        trackedProps[propName] = val;
      }
    });
    return trackedProps;
  };

  this.updateCurrent = function (current) {
    if (!_this2.state.history[current]) {
      return;
    }
    _this2.setState({
      current: current
    });
    _this2.props.onChange(_this2.state.history[current]);
  };

  this.canUndo = function () {
    return _this2.state.current > 0;
  };

  this.canRedo = function () {
    return _this2.state.current < _this2.state.history.length - 1;
  };

  this.undo = function () {
    if (!_this2.canUndo()) {
      return;
    }
    _this2.updateCurrent(_this2.state.current - 1);
  };

  this.redo = function () {
    if (!_this2.canRedo()) {
      return;
    }
    _this2.updateCurrent(_this2.state.current + 1);
  };

  this.addStep = function () {
    var changed = _this2.getTrackedProps(_this2.props);
    _this2.addNewHistoryElement(changed);
  };
};

exports.default = UndoRedo;