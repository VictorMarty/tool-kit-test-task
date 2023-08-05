import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import store from './app/store.ts'
import { Provider } from 'react-redux'
import Main from './pages/main/index.tsx'
import RepoPage from './pages/repoPage/index.tsx'
import router from './app/router/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}
      />
    </Provider>
  </React.StrictMode>,
)
