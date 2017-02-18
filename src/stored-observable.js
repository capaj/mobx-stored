/* global localStorage */
import {observable, autorunAsync, extendObservable} from 'mobx'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'

function storedObservable (key, defaultValue, debounce = 500) {
  let fromStorage = localStorage.getItem(key)
  const defaultClone = cloneDeep(defaultValue)  // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
  if (fromStorage) {
    merge(defaultClone, JSON.parse(fromStorage))
  }
  const obsVal = observable(defaultClone)
  const dispose = autorunAsync(() => {
    localStorage.setItem(key, JSON.stringify(obsVal))
  }, debounce)
  obsVal.reset = () => {
    extendObservable(obsVal, defaultValue)
  }
  obsVal.dispose = () => {
    dispose()
    localStorage.removeItem(key)
  }
  return obsVal
}

export default storedObservable

