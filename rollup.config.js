//import resolve from '@rollup/plugin-node-resolve';
//import commonjs from '@rollup/plugin-commonjs';

export default {
  //input: 'src/main.js', // Entry point of your application
  output: {
    file: 'public/bundle.js', // Output bundle file
    format: 'esm', //iife Immediately Invoked Function Expression format
    name: 'MyApp' // Global variable name for your IIFE bundle
  },
  plugins: [
    //resolve(), // Resolves node_modules
    //commonjs() // Converts CommonJS modules to ES6
  ]
};