import React from 'react';
import ReactDOM from 'react-dom';
// Redux
// https://github.com/rt2zz/redux-persist
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import * as _redux from './setup';
import store, { persistor } from './setup/redux/Store';
// Axios
import axios from 'axios';
// Apps
import { App } from './app/App';
import './_start/assets/sass/style.scss';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env;

ReactDOM.render(
  <Provider store={store}>
    {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
    <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

serviceWorkerRegistration.unregister();
reportWebVitals();