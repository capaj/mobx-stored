/* global localStorage, sessionStorage */
import { observable, autorun, set, toJS } from 'mobx'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'
import isObject from 'lodash.isobject'
const reservedKeys = ['reset', 'extend', 'destroy']

const checkReservedKeys = obj => {
  if (isObject(obj)) {
    Object.keys(obj).forEach(key => {
      if (reservedKeys.includes(key)) {
        throw new TypeError(
          `property ${key} is reserved for storedObservable method`
        )
      }
    })
  }
}

function factory(storage) {
  if (typeof process !== 'undefined' || process.release.name === 'node') return

  return function storedObservable(
    key,
    defaultValue,
    autorunOpts = { delay: 500 }
  ) {
    let fromStorage = storage.getItem(key)
    checkReservedKeys(defaultValue)
    checkReservedKeys(fromStorage)

    const defaultClone = cloneDeep(defaultValue) // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
    if (fromStorage) {
      merge(defaultClone, JSON.parse(fromStorage))
    }

    const obsVal = observable(defaultClone)
    let disposeAutorun
    const establishAutorun = () => {
      disposeAutorun = autorun(() => {
        storage.setItem(key, JSON.stringify(toJS(obsVal)))
      }, autorunOpts)
    }
    establishAutorun()

    const propagateChangesToMemory = e => {
      if (e.key === key) {
        disposeAutorun()
        const newValue = JSON.parse(e.newValue)
        set(obsVal, newValue)

        establishAutorun()
      }
    }
    window.addEventListener('storage', propagateChangesToMemory)

    obsVal.reset = () => {
      disposeAutorun && disposeAutorun()
      set(obsVal, defaultValue)
      Object.keys(obsVal).forEach(key => {
        if (
          !defaultValue.hasOwnProperty(key) &&
          !['reset', 'extend', 'destroy'].includes(key)
        ) {
          delete obsVal[key]
        }
      })
      establishAutorun()
    }
    obsVal.extend = obj => {
      disposeAutorun && disposeAutorun()
      set(obsVal, obj)
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
