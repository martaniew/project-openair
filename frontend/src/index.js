import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import './bootstrap.min.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  <Provider store={store}>
    <CookiesProvider>
    <App />
    </CookiesProvider>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
