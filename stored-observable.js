'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mobx = require('mobx');
var merge = _interopDefault(require('lodash.merge'));
var cloneDeep = _interopDefault(require('lodash.clonedeep'));
var omit = _interopDefault(require('lodash.omit'));
var traverse = _interopDefault(require('traverse'));

const findGetters = (obj) => {
  const getters = [];
  traverse(obj).forEach(function (x) {
    if (this.isRoot) {
      return
    }
    const descriptor = Object.getOwnPropertyDescriptor(this.parent.node, this.key);
    if (descriptor.get) {
      getters.push(this.path);
    }
  });
  return getters
};

/* global localStorage */
function storedObservable (key, defaultValue, debounce = 500) {
  let fromStorage = localStorage.getItem(key);
  const getterPaths = findGetters(defaultValue);
  const defaultClone = cloneDeep(defaultValue);  // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
  if (fromStorage) {
    merge(defaultClone, JSON.parse(fromStorage));
  }
  const getStateWithoutComputeds = () => {
    return omit(obsVal, getterPaths)
  };
  const obsVal = mobx.observable(defaultClone);
  const dispose = mobx.autorunAsync(() => {
    localStorage.setItem(key, JSON.stringify(getStateWithoutComputeds()));
  }, debounce);
  obsVal.reset = () => {
    mobx.extendObservable(obsVal, defaultValue);
  };
  obsVal.dispose = () => {
    dispose();
    localStorage.removeItem(key);
  };
  return obsVal
}

module.exports = storedObservable;
