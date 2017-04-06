import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/stored-observable.js',
  plugins: [babel()],
  targets: [
    {dest: 'dist/stored-observable.cjs.js', format: 'cjs'},
    {dest: 'dist/stored-observable.es.js', format: 'es'}
  ]
}
