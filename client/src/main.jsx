import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import IntakeProvider from "./context/IntakeProvider.jsx";
import GlobalStyle from "./styles/GlobalStyle.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyle />
    <IntakeProvider>
      <App />
    </IntakeProvider>
  </StrictMode>,
);
