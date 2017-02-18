'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mobx = require('mobx');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global localStorage */
function storedObservable(key, defaultValue) {
  var debounce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

  var fromStorage = localStorage.getItem(key);
  var defaultClone = defaultValue; // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
  if (fromStorage) {
    (0, _lodash2.default)(defaultClone, JSON.parse(fromStorage));
  }
  var obsVal = (0, _mobx.observable)(defaultClone);
  var dispose = (0, _mobx.autorunAsync)(function () {
    localStorage.setItem(key, JSON.stringify(obsVal));
  }, debounce);
  obsVal.reset = function () {
    (0, _mobx.extendObservable)(obsVal, defaultValue);
  };
  obsVal.dispose = function () {
    dispose();
    localStorage.removeItem(key);
  };
  return obsVal;
}

exports.default = storedObservable;
