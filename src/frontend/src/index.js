import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App/App'
import registerServiceWorker from './registerServiceWorker'

import './Themes/light-theme.css'
import './Themes/dark-theme.css'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
