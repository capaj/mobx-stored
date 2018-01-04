/* global localStorage */
import './sessionStorage-mock'
import 'localstorage-polyfill'
import test from 'ava'
import { localStored } from './stored-observable'

global.window = {
  addEventListener() {},
  removeEventListener() {}
}

test.cb('saves in localStorage, resets and disposes', t => {
  const def = { a: 1, b: 2 }
  const obs = localStored('test', def, 1)
  setTimeout(() => {
    t.is(localStorage.test, '{"a":1,"b":2}')

    obs.a += 1
    setTimeout(() => {
      t.is(localStorage.test, '{"a":2,"b":2}')
      obs.reset()
      t.is(obs.a, 1)
      setTimeout(() => {
        t.is(localStorage.test, '{"a":1,"b":2}')
        obs.dispose()
        t.is(localStorage.test, undefined)
        t.end()
      }, 2)
    }, 2)
  }, 2)
})

test('resets even if stored before', t => {
  localStorage.testThree = '{"a":10,"b":11}'
  const def = { a: 1, b: 2 }
  const obs = localStored('testThree', def, 1)
  obs.reset()
  t.is(obs.a, 1)
  t.is(obs.b, 2)
})

test.cb('extends existing value', t => {
  localStorage.testTwo = '{"a":5,"b":8}'
  const def = { a: 1, b: 2, c: 0 }
  const obs = localStored('testTwo', def, 1)
  t.is(obs.a, 5)
  t.is(obs.c, 0)
  t.end()
})
