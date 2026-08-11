/// <reference types="vite/client" />

import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const App = () => createElement('div', null, 'App')

createRoot(document.getElementById('root')!).render(
  createElement(
    StrictMode,
    null,
    createElement(App, null),
  ),
)
