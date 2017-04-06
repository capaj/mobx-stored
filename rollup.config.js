import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/stored-observable.js',
  plugins: [babel()],
  targets: [
    {dest: 'stored-observable.cjs.js', format: 'cjs'},
    {dest: 'stored-observable.es.js', format: 'es'}
  ]
}
