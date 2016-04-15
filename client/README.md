# A client of the Monopoly game

This is a client of the Monopoly game. We used basic structure, based on MVC pattern. The controller handles the events, updates model and then updates view. View is independent of model as it has API that controller calls, passing all needed informations. 

## Building

The client requires `tsc` compiler to build. There is a simple `tsconfig.json` file available which converts the source code to single `app.js` file, compatible with `ES5` standard, in the `js` directory. To compile the program just type `tsc` command inside the `client` directory.