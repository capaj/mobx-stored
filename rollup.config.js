import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/stored-observable.ts',
  plugins: [typescript()],
  output: [
    { file: 'dist/stored-observable.cjs.js', format: 'cjs' },
    { file: 'dist/stored-observable.es.js', format: 'es' }
  ]
}
