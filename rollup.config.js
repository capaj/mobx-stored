import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/stored-observable.ts',
  plugins: [typescript()],
  external: (id) => !id.startsWith('.') && !id.startsWith('/'),
  output: [
    { file: 'dist/stored-observable.cjs.js', format: 'cjs' },
    { file: 'dist/stored-observable.es.js', format: 'es' }
  ]
}
