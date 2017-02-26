/* global localStorage */
import {observable, autorunAsync, extendObservable} from 'mobx'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'
import omit from 'lodash.omit'
import findGetters from './find-getters'

function storedObservable (key, defaultValue, debounce = 500) {
  let fromStorage = localStorage.getItem(key)
  const getterPaths = findGetters(defaultValue)
  const defaultClone = cloneDeep(defaultValue)  // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
  if (fromStorage) {
    merge(defaultClone, JSON.parse(fromStorage))
  }
  const getStateWithoutComputeds = () => {
    return omit(obsVal, getterPaths)
  }
  const obsVal = observable(defaultClone)
  const dispose = autorunAsync(() => {
    localStorage.setItem(key, JSON.stringify(getStateWithoutComputeds()))
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

