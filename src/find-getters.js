import traverse from 'traverse'

const findGetters = (obj) => {
  const getters = []
  traverse(obj).forEach(function (x) {
    if (this.isRoot) {
      return
    }
    const descriptor = Object.getOwnPropertyDescriptor(this.parent.node, this.key)
    if (descriptor.get) {
      getters.push(this.path)
    }
  })
  return getters
}

export default findGetters
