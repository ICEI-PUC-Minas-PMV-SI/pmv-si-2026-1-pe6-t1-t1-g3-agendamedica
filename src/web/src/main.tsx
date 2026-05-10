import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App";

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{ padding: 20, color: "red", background: "white", height: "100vh", zIndex: 9999, position: "relative" }}>
          <h1>Erro Fatal no React</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String((this.state as any).error)}</pre>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 20, fontSize: 12 }}>{(this.state as any).error?.stack}</pre>
        </div>
      );
    }
    return (this.props as any).children;
  }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>,
);
