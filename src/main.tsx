import React from "react";
import ReactDOM from "react-dom/client";
import "./shared/styles/index.css";
import { RouterProvider } from "react-router-dom";
import store from "./app/store/store.ts";
import { Provider } from "react-redux";
import router from "./app/router/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
