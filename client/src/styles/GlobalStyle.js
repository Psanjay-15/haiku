import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    color: #17211d;
    background: #f3f1eb;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    --color-ink: #17211d;
    --color-muted: #66706b;
    --color-accent: #bd593b;
    --color-border: #dedbd3;
    --color-surface: #fffdf8;
    --color-success: #34745b;
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    background: #f3f1eb;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background:
      radial-gradient(circle at 8% 5%, rgb(189 89 59 / 9%), transparent 27%),
      radial-gradient(circle at 92% 12%, rgb(52 116 91 / 8%), transparent 30%),
      #f3f1eb;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  ::selection {
    background: rgb(194 84 49 / 20%);
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media print {
    @page { size: A4; margin: 12mm; }

    :root { background: #fff; }
    body { background: #fff; color: #111; }
  }
`;

export default GlobalStyle;
