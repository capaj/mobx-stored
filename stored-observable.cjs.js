'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mobx = require('mobx');
var merge = _interopDefault(require('lodash.merge'));
var cloneDeep = _interopDefault(require('lodash.clonedeep'));
var omit = _interopDefault(require('lodash.omit'));
var traverse = _interopDefault(require('traverse'));

var findGetters = function findGetters(obj) {
  var getters = [];
  traverse(obj).forEach(function (x) {
    if (this.isRoot) {
      return;
    }
    var descriptor = Object.getOwnPropertyDescriptor(this.parent.node, this.key);
    if (descriptor.get) {
      getters.push(this.path);
    }
  });
  return getters;
};

/* global localStorage */
function storedObservable(key, defaultValue) {
  var debounce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

  var fromStorage = localStorage.getItem(key);
  var getterPaths = findGetters(defaultValue);
  var defaultClone = cloneDeep(defaultValue); // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
  if (fromStorage) {
    merge(defaultClone, JSON.parse(fromStorage));
  }
  var getStateWithoutComputeds = function getStateWithoutComputeds() {
    return omit(obsVal, getterPaths);
  };
  var obsVal = mobx.observable(defaultClone);
  var disposeAutorun = void 0;
  var establishAutorun = function establishAutorun() {
    disposeAutorun = mobx.autorunAsync(function () {
      localStorage.setItem(key, JSON.stringify(getStateWithoutComputeds()));
    }, debounce);
  };
  establishAutorun();

  var propagateChangesToMemory = function propagateChangesToMemory(e) {
    if (e.key === key) {
      disposeAutorun();
      var newValue = JSON.parse(e.newValue);
      mobx.extendObservable(obsVal, newValue);

      establishAutorun();
    }
  };
  window.addEventListener('storage', propagateChangesToMemory);

  obsVal.reset = function () {
    mobx.extendObservable(obsVal, defaultValue);
  };
  obsVal.dispose = function () {
    disposeAutorun();
    localStorage.removeItem(key);
    window.removeEventListener(propagateChangesToMemory);
  };
  return obsVal;
}

module.exports = storedObservable;
