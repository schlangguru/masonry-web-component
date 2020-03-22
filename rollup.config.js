import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json'

export default {
  input: [
    'src/ScMasonry.ts',
    'src/ScMasonryImg.ts'
  ],
  output: [
    {
      dir: 'dist',
      format: 'es',
      sourcemap: true
    },
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    resolve(),
    typescript(),
    commonjs()
  ],
}