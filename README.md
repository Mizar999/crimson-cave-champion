# Crimson Cave Champion

A roguelike built with rot.js and TypeScript.

https://mizar999.github.io/crimson-cave-champion/

## Resources

- [rot.js - Roguelike Toolkit](https://github.com/ondras/rot.js)

## How to run

After cloning the repository:

- Install necessary packages

    ```powershell
    npm install
    ```

- To build the application run:

    ```powershell
    npm run build
    ```

- To run multiple npm scripts cross platform in parallel run the following command:

    ```powershell
    # if globally installed
    concurrently npm:watch npm:serve

    # if locally installed
    npx concurrently npm:watch npm:serve
    ```

## Initial Project setup

If you're interested here is my initial project setup:

- Init npm and install necessary packages

    ```powershell
    npm init -y
    npm install --save-dev typescript@4.7.3 ts-loader@9.3.0 rot-js@2.2.0 webpack@5.73.0 webpack-cli@4.9.2 http-server@14.1.1 concurrently@7.2.1
    ```

- Create **Webpack** configuration `webpack.config.js`:

    ```javascript
    const path = require('path');

    module.exports = {
    entry: './src/app.ts',
    module: {
        rules:[{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
    };
    ```

- Webpack will get the sources from `src/app.ts` and collect everything in `dist/app.js` file
- Create **TypeScript** configuration `tsconfig.json`:

    ```json
    {
        "compilerOptions": {
            "target": "es5",
            "lib": [
                "dom",
                "es2015"
            ]
        },
        "include": [
            "src/*"
        ]
    }
    ```

- Update the **scripts**-section of the `package.json` file:

    ```json
    "scripts": {
        "build": "webpack",
        "watch": "webpack --watch",
        "serve": "http-server --port=8085 -c-1"
    }
    ```
