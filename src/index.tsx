import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Router>
    {/* <React.StrictMode> */}
    <Provider store={store}>
      <App />
    </Provider>
    {/* </React.StrictMode> */}
  </Router>
);

reportWebVitals();
