import findGetters from './find-getters'
import test from 'ava'

test('finds', t => {
  const def = {
    a: 1,
    b: 2,
    get sum () {
      return this.a + this.b
    },
    get sum2 () {
      return this.a + this.b
    }
  }
  t.deepEqual(findGetters(def), [['sum'], ['sum2']])
})
