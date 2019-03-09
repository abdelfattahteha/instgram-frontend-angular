# InstgramFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.5.

## About App
Frontend app with angular that clones facebook

You can check project preview on youtube - [youtube video](https://www.youtube.com/watch?v=YvEOmFwjc-E)

## Setup 

1- Run `npm install` to install all dependencies.

2- Install backend API, you can find it in this repository [Backend Repository](https://github.com/abdelfattahteha/instgram-clone-api)

3- Edit backend configuration in `environments` folder in `environment.ts` file edit `apiUrl` property to your api endpoint, for me api in `localhost` on port `3000`
```javascript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000"
};
``` 

4- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
  


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
