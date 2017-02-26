'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mobx = require('mobx');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.clonedeep');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.omit');

var _lodash6 = _interopRequireDefault(_lodash5);

var _findGetters = require('./find-getters');

var _findGetters2 = _interopRequireDefault(_findGetters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function storedObservable(key, defaultValue) {
  var debounce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

  var fromStorage = localStorage.getItem(key);
  var getterPaths = (0, _findGetters2.default)(defaultValue);
  var defaultClone = (0, _lodash4.default)(defaultValue); // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
  if (fromStorage) {
    (0, _lodash2.default)(defaultClone, JSON.parse(fromStorage));
  }
  var getStateWithoutComputeds = function getStateWithoutComputeds() {
    return (0, _lodash6.default)(obsVal, getterPaths);
  };
  var obsVal = (0, _mobx.observable)(defaultClone);
  var dispose = (0, _mobx.autorunAsync)(function () {
    localStorage.setItem(key, JSON.stringify(getStateWithoutComputeds()));
  }, debounce);
  obsVal.reset = function () {
    (0, _mobx.extendObservable)(obsVal, defaultValue);
  };
  obsVal.dispose = function () {
    dispose();
    localStorage.removeItem(key);
  };
  return obsVal;
} /* global localStorage */
exports.default = storedObservable;
