// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  weatherAPI: 'http://api.openweathermap.org/data/2.5',
  weatherAPIKEY: '5a4b2d457ecbef9eb2a71e480b947604',//'491c5c8f06521146afb9c575819c23ca'
  weatherCountryCode: 'us',
  weatherUnit: 'imperial',
  weatherForcastDays: '5',
  weatherIconUri: 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/',
  useMock: false,
  storeExpirationInMilliseconds: 2 * 60 * 60 * 1000// Hours * Minutes * Seconds * Milliseconds
};
