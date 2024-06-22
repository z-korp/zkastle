import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./ui/elements/sonner";
import { Home } from "./ui/screens/Home";
import { ThemeProvider } from "./ui/elements/theme-provider";

import "./App.css";

export const SceneManager = () => {
  return <Home />;
};

export default () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<SceneManager />} />
          </Routes>
          <Toaster position="bottom-right" />
        </Router>
      </ThemeProvider>
    </>
  );
};
