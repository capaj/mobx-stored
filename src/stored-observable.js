/* global localStorage, sessionStorage */
import { observable, autorunAsync, extendObservable, toJS } from 'mobx'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'

function factory(storage) {
  return function storedObservable(key, defaultValue, debounce = 500) {
    let fromStorage = storage.getItem(key)

    const defaultClone = cloneDeep(defaultValue) // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
    if (fromStorage) {
      merge(defaultClone, JSON.parse(fromStorage))
    }

    const obsVal = observable(defaultClone)
    let disposeAutorun
    const establishAutorun = () => {
      disposeAutorun = autorunAsync(() => {
        storage.setItem(key, JSON.stringify(toJS(obsVal)))
      }, debounce)
    }
    establishAutorun()

    const propagateChangesToMemory = e => {
      if (e.key === key) {
        disposeAutorun()
        const newValue = JSON.parse(e.newValue)
        extendObservable(obsVal, newValue)

        establishAutorun()
      }
    }
    window.addEventListener('storage', propagateChangesToMemory)

    obsVal.reset = () => {
      disposeAutorun && disposeAutorun()
      extendObservable(obsVal, defaultValue)
      establishAutorun()
    }
    obsVal.extend = obj => {
      disposeAutorun && disposeAutorun()
      extendObservable(obsVal, obj)
      establishAutorun()
    }
    obsVal.destroy = () => {
      disposeAutorun()
      storage.removeItem(key)
      window.removeEventListener('storage', propagateChangesToMemory)
    }
    return obsVal
  }
}

export const localStored = factory(localStorage)
export const sessionStored = factory(sessionStorage)
