/* global localStorage, sessionStorage */
import { observable, autorun, set, remove, toJS } from 'mobx'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'
import isObject from 'lodash.isobject'
const reservedKeys = ['reset', 'extend', 'destroy']

const checkReservedKeys = (obj: any) => {
  if (isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      if (reservedKeys.includes(key)) {
        throw new TypeError(
          `property ${key} is reserved for storedObservable method`
        )
      }
    })
  }
}

interface StoredObservable {
  reset: () => void
  destroy: () => void
  extend: (obj: object) => void
}

function factory(storage: Storage) {
  return function storedObservable<T>(
    key: string,
    defaultValue: object,
    autorunOpts = { delay: 500 }
  ): T & StoredObservable {
    let fromStorage = storage.getItem(key)
    checkReservedKeys(defaultValue)
    checkReservedKeys(fromStorage)
    let disposeAutorun: () => any

    const defaultClone: T & StoredObservable = {
      ...((cloneDeep(defaultValue) as any) as T),
      reset() {
        disposeAutorun && disposeAutorun()
        set(obsVal, defaultValue)
        Object.keys(obsVal).forEach((key) => {
          if (
            !defaultValue.hasOwnProperty(key) &&
            !['reset', 'extend', 'destroy'].includes(key)
          ) {
            remove(obsVal, key)
          }
        })
        establishAutorun()
      },
      extend(obj: object) {
        disposeAutorun && disposeAutorun()
        set(obsVal, obj)
        establishAutorun()
      },
      destroy() {
        disposeAutorun()
        storage.removeItem(key)
        window.removeEventListener('storage', propagateChangesToMemory)
      }
    } // we don't want to modify the given object, because userscript might want to use the original object to reset the state back to default values some time later
    if (fromStorage) {
      merge(defaultClone, JSON.parse(fromStorage))
    }

    const obsVal = observable(defaultClone)
    const establishAutorun = () => {
      disposeAutorun = autorun(() => {
        storage.setItem(key, JSON.stringify(toJS(obsVal)))
      }, autorunOpts)
    }
    establishAutorun()

    const propagateChangesToMemory = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        disposeAutorun()

        const newValue = JSON.parse(e.newValue)
        set(obsVal, newValue)

        establishAutorun()
      }
    }
    window.addEventListener('storage', propagateChangesToMemory)

    return obsVal
  }
}

export const localStored = factory(localStorage)
export const sessionStored = factory(sessionStorage)
