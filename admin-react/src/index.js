import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import {store, persistor} from "./redux/store"
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <DarkModeContextProvider>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> 
      <App />
      </PersistGate>
    </Provider>
    </DarkModeContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

